"""Data coordinator for DigitalPour."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import timedelta
import logging
import re

from aiohttp import ClientError
from bs4 import BeautifulSoup
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_SCAN_INTERVAL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    CONF_COMPANY_ID,
    CONF_LOCATION_ID,
    DEFAULT_SCAN_INTERVAL_MINUTES,
    DEFAULT_LOCATION_ID,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MAX_KEG_LEVEL_PX,
    MENU_URL,
    MIN_SCAN_INTERVAL_MINUTES,
)

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class TapItem:
    """Normalized tap item."""

    tap_number: str
    producer: str
    beverage: str
    beverage_style: str
    beverage_color: str | None
    location: str
    abv: float | None
    just_tapped: bool
    keg_level_percent: int | None
    keg_level_color: str | None
    logo_url: str | None


class DigitalPourCoordinator(DataUpdateCoordinator[dict[str, object]]):
    """Coordinate DigitalPour data retrieval."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.config_entry = entry
        self._company_id = entry.data[CONF_COMPANY_ID]
        self._location_id = entry.data.get(CONF_LOCATION_ID, DEFAULT_LOCATION_ID)

        scan_interval_value = entry.options.get(
            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_MINUTES
        )
        scan_interval = _scan_interval_to_timedelta(scan_interval_value)
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN}_{entry.entry_id}",
            update_interval=scan_interval,
        )

    @property
    def unique_prefix(self) -> str:
        """Return a stable unique prefix for entity IDs."""
        return f"{self._company_id}_{self._location_id}"

    async def _async_update_data(self) -> dict[str, object]:
        """Fetch and parse menu data."""
        session = async_get_clientsession(self.hass)
        params = {"companyID": self._company_id, "locationID": self._location_id}

        try:
            async with session.get(MENU_URL, params=params, timeout=25) as response:
                response.raise_for_status()
                html = await response.text()
        except (TimeoutError, ClientError) as err:
            raise UpdateFailed(f"Failed to fetch DigitalPour menu: {err}") from err

        taps = _parse_menu(html)
        if not taps:
            raise UpdateFailed(
                "No taps were parsed. Verify company_id/location_id for this DigitalPour menu."
            )

        just_tapped_count = sum(1 for tap in taps if tap.just_tapped)
        levels = [tap.keg_level_percent for tap in taps if tap.keg_level_percent is not None]
        average_level = round(sum(levels) / len(levels)) if levels else None

        return {
            "taps": [asdict(tap) for tap in taps],
            "tap_count": len(taps),
            "just_tapped_count": just_tapped_count,
            "average_keg_level_percent": average_level,
        }


def _parse_menu(html: str) -> list[TapItem]:
    """Parse DigitalPour menu HTML into normalized tap objects."""
    soup = BeautifulSoup(html, "html.parser")
    items: list[TapItem] = []

    for row in soup.select("div.lineItem"):
        tap_number = _text_or_empty(row.select_one("div.tapName"))

        info_node = None
        for candidate in row.select("div.beverageInfo"):
            style = (candidate.get("style") or "").replace(" ", "").lower()
            if "display:table-cell" in style:
                info_node = candidate
                break

        if info_node is None:
            continue

        abv_text = _text_or_empty(info_node.select_one("div.abv"))
        beverage_color = _beverage_color(info_node.select_one("div.beverageColor"))
        just_tapped = _is_just_tapped(row.select_one("div.justTapped"))
        keg_level_percent = _keg_percent(row.select_one("div.kegLevel"))
        keg_level_color = _keg_color(row.select_one("div.kegLevel"))
        logo_img = row.select_one("img.beverageLogo")

        items.append(
            TapItem(
                tap_number=tap_number,
                producer=_text_or_empty(info_node.select_one("div.producerName")),
                beverage=_text_or_empty(info_node.select_one("div.beverageName")),
                beverage_style=_text_or_empty(info_node.select_one("div.beverageStyle")),
                beverage_color=beverage_color,
                location=_text_or_empty(info_node.select_one("div.producerLocation")),
                abv=_parse_percent_value(abv_text),
                just_tapped=just_tapped,
                keg_level_percent=keg_level_percent,
                keg_level_color=keg_level_color,
                logo_url=logo_img.get("src") if logo_img else None,
            )
        )

    return items


def _text_or_empty(node) -> str:
    return node.get_text(" ", strip=True) if node else ""


def _parse_percent_value(text: str) -> float | None:
    match = re.search(r"(-?\d+(?:\.\d+)?)\s*%", text)
    if not match:
        return None
    return float(match.group(1))


def _is_just_tapped(node) -> bool:
    if not node:
        return False

    style = (node.get("style") or "").replace(" ", "").lower()
    # DigitalPour hides this with opacity:0 when false.
    opacity_match = re.search(r"opacity:([0-9.]+)", style)
    if opacity_match:
        try:
            return float(opacity_match.group(1)) > 0
        except ValueError:
            return False

    return bool(node.get_text(strip=True))


def _keg_percent(node) -> int | None:
    if not node:
        return None

    style = (node.get("style") or "").replace(" ", "").lower()
    match = re.search(r"height:(\d+(?:\.\d+)?)px", style)
    if not match:
        return None

    level_px = float(match.group(1))
    level_px = max(0.0, min(level_px, MAX_KEG_LEVEL_PX))
    return round((level_px / MAX_KEG_LEVEL_PX) * 100)


def _keg_color(node) -> str | None:
    if not node:
        return None

    style = node.get("style") or ""
    match = re.search(r"background:\s*(#[0-9a-fA-F]{6})", style)
    if not match:
        return None
    return match.group(1).upper()


def _beverage_color(node) -> str | None:
    if not node:
        return None

    style = node.get("style") or ""
    match = re.search(r"background:\s*(#[0-9a-fA-F]{6})", style)
    if not match:
        return None
    return match.group(1).upper()


def _scan_interval_to_timedelta(value: object) -> timedelta:
    """Convert stored scan interval value to a bounded timedelta."""
    min_seconds = MIN_SCAN_INTERVAL_MINUTES * 60
    max_seconds = MAX_SCAN_INTERVAL_MINUTES * 60

    if isinstance(value, dict):
        total_seconds = (
            int(value.get("hours", 0)) * 3600
            + int(value.get("minutes", 0)) * 60
            + int(value.get("seconds", 0))
        )
    elif isinstance(value, (int, float)):
        # Backward compatibility with older minute-based values.
        total_seconds = int(float(value) * 60)
    else:
        total_seconds = DEFAULT_SCAN_INTERVAL_MINUTES * 60

    total_seconds = max(min_seconds, min(total_seconds, max_seconds))
    return timedelta(seconds=total_seconds)
