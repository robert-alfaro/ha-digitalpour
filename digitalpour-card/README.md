# DigitalPour Card

A Home Assistant custom Lovelace card for displaying DigitalPour tap menus from the `sensor.*_tap_list` entity produced by this repo's DigitalPour integration.

## Features
- Tap list layout modeled after the DigitalPour webpage
- Tap number, producer, beverage name, style/location/ABV
- Keg level visualization and percent label
- `Just Tapped` badge support
- Optional producer logos
- Responsive layout for mobile/desktop
- Visual editor support in Lovelace (toggle sections and limits)

## Requirements
- Home Assistant with the DigitalPour integration from this repo
- A `tap_list` sensor whose attributes include `taps`

## Build
```bash
cd digitalpour-card
npm install
npm run build
```

This outputs:
- `dist/digitalpour-card.js`

## Install in Home Assistant
1. Copy `dist/digitalpour-card.js` to `config/www/digitalpour-card.js`.
2. Add as a dashboard resource:
   - URL: `/local/digitalpour-card.js`
   - Type: `module`
3. Add card to dashboard:

```yaml
type: custom:digitalpour-card
entity: sensor.my_taphouse_tap_list
title: Current Tap List
show_logos: true
max_rows: 30
```

## Card config
- `type` (required): `custom:digitalpour-card`
- `entity` (required): entity id of the tap list sensor
- `title` (optional): header text, default `Current Tap List`
- `show_title` (optional): default `true`
- `show_tap_number` (optional): default `true`
- `show_logos` (optional): default `true`
- `show_style` (optional): default `true`
- `show_details` (optional): default `true`
- `show_keg` (optional): default `true`
- `show_just_tapped` (optional): default `true`
- `show_level_percent` (optional): default `true`
- `max_rows` (optional): max taps to show

## Data shape expected
The card reads `entity.attributes.taps` where each item can include:
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
