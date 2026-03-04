# Home Assistant DigitalPour

Custom Home Assistant integration that scrapes the DigitalPour Facebook menu interface and creates sensors for the tap data.

## Install
### HACS (Manual Custom Repository)
1. Open HACS.
2. Go to the integrations section.
3. Open the 3-dot menu and choose `Custom repositories`.
4. Add this repository URL.
5. Category: `Integration`.
6. Install `DigitalPour` from HACS.
7. Restart Home Assistant.

### Manual
1. Copy `custom_components/digitalpour` into your Home Assistant config directory.
2. Restart Home Assistant.

## Add to Home Assistant
[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=digitalpour)

## How to Setup
In Home Assistant:
1. Go to `Settings -> Devices & Services -> Add Integration -> DigitalPour`.
2. Enter:
   - `name` (user-defined; venue name is not available from this endpoint)
   - `company id`
   - `location id` (default is `1`)
   - scan interval

Get values from your menu URL, for example:

`https://fbpage.digitalpour.com/?companyID=53053a4dfb890c0fc05243f9&locationID=1`

Map URL values to config:
- `companyID` -> `53053a4dfb890c0fc05243f9`
- `locationID` -> `1`

## Built-in Lovelace Card
This integration ships its own card (`custom:digitalpour-card`).

- Card JS lives at `custom_components/digitalpour/www/digitalpour-card.js`.
- On setup, it is copied to `/config/www/digitalpour/digitalpour-card.js`.
- The integration auto-registers `/local/digitalpour/digitalpour-card.js` as a Lovelace module resource.

If needed, run service:
- `digitalpour.register_card_resources`

## Sensors Created
- `sensor.<name>_tap_count`
- `sensor.<name>_just_tapped_count`
- `sensor.<name>_average_keg_level`
- `sensor.<name>_tap_list`

`tap_list` attributes include:
- `taps` (list of objects)
- `tap_numbers`
- `beverages`
- `just_tapped_taps`

Each tap object includes:
- `tap_number`
- `producer`
- `beverage`
- `beverage_style`
- `beverage_color`
- `location`
- `abv`
- `just_tapped`
- `keg_level_percent`
- `keg_level_color`
- `logo_url`

## Notes
- Data source is the DigitalPour Facebook menu interface (`fbpage.digitalpour.com`).
- Keg level is estimated from the visual height field in the HTML (`div.kegLevel`).
- If no taps are parsed, verify `companyID` and `locationID` from the menu URL.
- Venue/company name cannot be fetched from this interface; `name` must be user-provided.
