"""Constants for the DigitalPour integration."""

DOMAIN = "digitalpour"
PLATFORMS = ["sensor"]

CONF_COMPANY_ID = "company_id"
CONF_LOCATION_ID = "location_id"

DEFAULT_NAME = "DigitalPour"
DEFAULT_SCAN_INTERVAL_MINUTES = 15
DEFAULT_LOCATION_ID = "1"
MIN_SCAN_INTERVAL_MINUTES = 1
MAX_SCAN_INTERVAL_MINUTES = 120

MENU_URL = "https://fbpage.digitalpour.com/"

MAX_KEG_LEVEL_PX = 37.0

CARD_RESOURCE_DIR = DOMAIN
CARD_FILENAME = f"{DOMAIN}-card.js"
SERVICE_REGISTER_CARD_RESOURCES = "register_card_resources"
