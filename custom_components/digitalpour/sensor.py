"""Sensor platform for DigitalPour."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import DigitalPourCoordinator


@dataclass(frozen=True, kw_only=True)
class DigitalPourSensorDescription(SensorEntityDescription):
    """Describe DigitalPour sensor entity."""

    value_fn: Callable[[dict[str, Any]], Any]
    attrs_fn: Callable[[dict[str, Any]], dict[str, Any]] | None = None


SENSOR_TYPES: tuple[DigitalPourSensorDescription, ...] = (
    DigitalPourSensorDescription(
        key="tap_count",
        name="Tap Count",
        icon="mdi:beer",
        value_fn=lambda data: data.get("tap_count"),
    ),
    DigitalPourSensorDescription(
        key="just_tapped_count",
        name="Just Tapped Count",
        icon="mdi:star-circle-outline",
        value_fn=lambda data: data.get("just_tapped_count"),
    ),
    DigitalPourSensorDescription(
        key="average_keg_level_percent",
        name="Average Keg Level",
        icon="mdi:gauge",
        native_unit_of_measurement=PERCENTAGE,
        value_fn=lambda data: data.get("average_keg_level_percent"),
    ),
    DigitalPourSensorDescription(
        key="tap_list",
        name="Tap List",
        icon="mdi:clipboard-list-outline",
        value_fn=lambda data: data.get("tap_count"),
        attrs_fn=lambda data: {
            "taps": data.get("taps", []),
            "tap_numbers": [tap.get("tap_number") for tap in data.get("taps", [])],
            "beverages": [tap.get("beverage") for tap in data.get("taps", [])],
            "just_tapped_taps": [
                tap.get("tap_number")
                for tap in data.get("taps", [])
                if tap.get("just_tapped") is True
            ],
        },
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities from a config entry."""
    coordinator: DigitalPourCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        DigitalPourSensor(coordinator, entry, description) for description in SENSOR_TYPES
    )


class DigitalPourSensor(CoordinatorEntity[DigitalPourCoordinator], SensorEntity):
    """Representation of a DigitalPour sensor."""

    entity_description: DigitalPourSensorDescription

    def __init__(
        self,
        coordinator: DigitalPourCoordinator,
        entry: ConfigEntry,
        description: DigitalPourSensorDescription,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.unique_prefix}_{description.key}"
        self._attr_has_entity_name = True
        self._attr_device_info = {
            "identifiers": {(DOMAIN, coordinator.unique_prefix)},
            "name": entry.title,
            "manufacturer": "DigitalPour",
            "model": "Menu",
        }

    @property
    def native_value(self) -> Any:
        """Return the state."""
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return extra attributes."""
        if self.entity_description.attrs_fn is None:
            return None
        return self.entity_description.attrs_fn(self.coordinator.data)
