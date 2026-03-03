"""Config flow for DigitalPour."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_COMPANY_ID,
    CONF_POLL_MINUTES,
    DEFAULT_NAME,
    DEFAULT_POLL_MINUTES,
    DOMAIN,
    MAX_POLL_MINUTES,
    MIN_POLL_MINUTES,
)


class DigitalPourConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for DigitalPour."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            company_id = user_input[CONF_COMPANY_ID].strip()
            name = user_input["name"].strip() or DEFAULT_NAME

            unique_id = company_id
            await self.async_set_unique_id(unique_id)
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=name,
                data={
                    CONF_COMPANY_ID: company_id,
                    "name": name,
                },
                options={
                    CONF_POLL_MINUTES: user_input.get(
                        CONF_POLL_MINUTES, DEFAULT_POLL_MINUTES
                    ),
                },
            )

        schema = vol.Schema(
            {
                vol.Required("name", default=DEFAULT_NAME): str,
                vol.Required(CONF_COMPANY_ID): str,
                vol.Optional(CONF_POLL_MINUTES, default=DEFAULT_POLL_MINUTES): vol.All(
                    vol.Coerce(int), vol.Range(min=MIN_POLL_MINUTES, max=MAX_POLL_MINUTES)
                ),
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
                    CONF_POLL_MINUTES,
                    default=self._config_entry.options.get(
                        CONF_POLL_MINUTES, DEFAULT_POLL_MINUTES
                    ),
                ): vol.All(
                    vol.Coerce(int), vol.Range(min=MIN_POLL_MINUTES, max=MAX_POLL_MINUTES)
                )
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
