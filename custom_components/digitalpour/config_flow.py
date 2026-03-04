"""Config flow for DigitalPour."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_NAME, CONF_SCAN_INTERVAL
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import (
    CONF_COMPANY_ID,
    CONF_LOCATION_ID,
    DEFAULT_LOCATION_ID,
    DEFAULT_SCAN_INTERVAL_MINUTES,
    DEFAULT_NAME,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
)


class DigitalPourConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for DigitalPour."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            company_id = user_input[CONF_COMPANY_ID].strip()
            location_id = user_input[CONF_LOCATION_ID].strip()
            name = user_input[CONF_NAME].strip() or DEFAULT_NAME

            unique_id = f"{company_id}_{location_id}"
            await self.async_set_unique_id(unique_id)
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=name,
                data={
                    CONF_COMPANY_ID: company_id,
                    CONF_LOCATION_ID: location_id,
                    CONF_NAME: name,
                },
                options={
                    CONF_SCAN_INTERVAL: _normalize_duration_input(
                        user_input.get(CONF_SCAN_INTERVAL)
                    ),
                },
            )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=DEFAULT_NAME): str,
                vol.Required(CONF_COMPANY_ID): str,
                vol.Required(CONF_LOCATION_ID, default=DEFAULT_LOCATION_ID): str,
                vol.Optional(
                    CONF_SCAN_INTERVAL,
                    default=_default_duration_dict(DEFAULT_SCAN_INTERVAL_MINUTES),
                ): selector.selector({"duration": {}}),
            }
        )

        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return DigitalPourOptionsFlow(config_entry)


class DigitalPourOptionsFlow(config_entries.OptionsFlow):
    """Handle DigitalPour options."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._config_entry = config_entry

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_SCAN_INTERVAL,
                    default=_default_duration_dict(
                        self._config_entry.options.get(
                            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_MINUTES
                        )
                    ),
                ): selector.selector({"duration": {}})
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)


def _default_duration_dict(value: Any) -> dict[str, int]:
    """Convert a stored interval value into duration selector format."""
    if isinstance(value, dict):
        return {
            "hours": int(value.get("hours", 0)),
            "minutes": int(value.get("minutes", 0)),
            "seconds": int(value.get("seconds", 0)),
        }

    try:
        minutes = int(value)
    except (TypeError, ValueError):
        minutes = DEFAULT_SCAN_INTERVAL_MINUTES

    minutes = max(MIN_SCAN_INTERVAL_MINUTES, min(minutes, MAX_SCAN_INTERVAL_MINUTES))
    return {"hours": minutes // 60, "minutes": minutes % 60, "seconds": 0}


def _normalize_duration_input(value: Any) -> dict[str, int]:
    """Normalize duration selector input and enforce configured bounds."""
    raw = _default_duration_dict(value)
    total_seconds = (
        raw.get("hours", 0) * 3600 + raw.get("minutes", 0) * 60 + raw.get("seconds", 0)
    )
    min_seconds = MIN_SCAN_INTERVAL_MINUTES * 60
    max_seconds = MAX_SCAN_INTERVAL_MINUTES * 60
    total_seconds = max(min_seconds, min(total_seconds, max_seconds))

    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return {"hours": hours, "minutes": minutes, "seconds": seconds}
