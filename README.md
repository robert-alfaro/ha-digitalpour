# Home Assistant DigitalPour Integration (Custom)

This custom integration scrapes DigitalPour Facebook menu pages and exposes sensors for:
- Tap count
- Just tapped count
- Average keg level (%)
- Full tap list (attributes include tap number, beer name, ABV, level, just tapped)

## What was discovered from the provided URL
Using:

`https://fbpage.digitalpour.com/?companyID=53053a4dfb890c0fc05243f9&locationID=1`

The page is server-rendered HTML. The tap data is already present in the response markup (`div.lineItem` rows), so it can be scraped directly without running JavaScript.

Reusable identifier:
- `companyID` (example: `53053a4dfb890c0fc05243f9`)

`locationID` appears fixed to `1` for these fbpage menus and is hardcoded by this integration.

## Install
1. Copy `custom_components/digitalpour` into your Home Assistant config directory.
2. Restart Home Assistant.
3. Go to Settings -> Devices & Services -> Add Integration -> `DigitalPour`.
4. Enter:
   - `company_id`
   - optional name
   - poll interval in minutes

## Sensors created
- `sensor.<name>_tap_count`
- `sensor.<name>_just_tapped_count`
- `sensor.<name>_average_keg_level`
- `sensor.<name>_tap_list`

`tap_list` attributes include:
- `taps` (list of objects)
- `tap_numbers`
- `beverages`
- `just_tapped_taps`

Each tap object contains:
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
- Keg level is estimated from the inline visual height (`div.kegLevel` height in pixels), scaled to percent.
- If no taps are parsed, verify that `company_id` is valid for that venue.
- Venue/company display name does not appear to be exposed in this page HTML, so the integration `name` remains user-provided.
