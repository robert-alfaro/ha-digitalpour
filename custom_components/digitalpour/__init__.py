"""The DigitalPour integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PLATFORMS
from .coordinator import DigitalPourCoordinator
from .www_manager import (
    async_register_cards,
    async_register_resources_service,
    async_setup_cards,
)

DATA_CARD_SETUP_DONE = "card_setup_done"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up DigitalPour from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    if not hass.data[DOMAIN].get(DATA_CARD_SETUP_DONE):
        await async_setup_cards(hass)
        await async_register_resources_service(hass)

        async def _auto_register_resources(_event=None) -> None:
            await async_register_cards(hass)

        if hass.is_running:
            await _auto_register_resources()
        else:
            hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _auto_register_resources)

        hass.data[DOMAIN][DATA_CARD_SETUP_DONE] = True

    coordinator = DigitalPourCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    await hass.config_entries.async_reload(entry.entry_id)
