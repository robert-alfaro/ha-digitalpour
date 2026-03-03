import { css, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface HomeAssistant {
  states: Record<string, HassEntity>;
}

interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

interface DigitalPourCardConfig {
  type: string;
  entity: string;
  title?: string;
  show_title?: boolean;
  show_tap_number?: boolean;
  show_logos?: boolean;
  show_style?: boolean;
  show_details?: boolean;
  show_keg?: boolean;
  show_just_tapped?: boolean;
  show_level_percent?: boolean;
  max_rows?: number;
}

interface TapItem {
  tap_number?: string;
  producer?: string;
  beverage?: string;
  beverage_style?: string;
  beverage_color?: string | null;
  location?: string;
  abv?: number | null;
  just_tapped?: boolean;
  keg_level_percent?: number | null;
  keg_level_color?: string | null;
  logo_url?: string | null;
}

const KEG_BOTTOM_IMAGE = "https://fbpage.digitalpour.com/empty_keg_bottom.png";
const KEG_FRONT_IMAGE = "https://fbpage.digitalpour.com/empty_keg_front.png";

@customElement("digitalpour-card")
export class DigitalpourCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: DigitalPourCardConfig;
  @state() private _brokenLogos: Record<string, true> = {};

  public static getStubConfig(): DigitalPourCardConfig {
    return {
      type: "custom:digitalpour-card",
      entity: "sensor.digitalpour_tap_list"
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("digitalpour-card-editor");
  }

  public setConfig(config: DigitalPourCardConfig): void {
    if (!config.entity) {
      throw new Error("Entity is required");
    }
    this._config = {
      show_title: true,
      show_tap_number: true,
      show_logos: true,
      show_style: true,
      show_details: true,
      show_keg: true,
      show_just_tapped: true,
      show_level_percent: true,
      ...config
    };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const entity = this.hass.states[this._config.entity];
    if (!entity) {
      return this._renderError(`Entity not found: ${this._config.entity}`);
    }

    const tapsRaw = entity.attributes.taps;
    if (!Array.isArray(tapsRaw)) {
      return this._renderError(`Entity ${entity.entity_id} has no 'taps' attribute list`);
    }

    const taps = tapsRaw as TapItem[];
    const sorted = [...taps].sort((a, b) => this._tapSort(a.tap_number, b.tap_number));
    const rows = this._config.max_rows ? sorted.slice(0, this._config.max_rows) : sorted;
    const showTitle = this._config.show_title !== false;

    return html`
      <ha-card>
        <div class="wrapper">
          ${showTitle ? html`<div class="header">${this._config.title ?? "Current Tap List"}</div>` : nothing}
          <div class="list">
            ${rows.map((tap) => this._renderRow(tap))}
          </div>
        </div>
      </ha-card>
    `;
  }

  protected _renderRow(tap: TapItem): TemplateResult {
    const showTapNumber = this._config?.show_tap_number !== false;
    const showLogos = this._config?.show_logos !== false;
    const showStyle = this._config?.show_style !== false;
    const showDetails = this._config?.show_details !== false;
    const showKeg = this._config?.show_keg !== false;
    const showJustTapped = this._config?.show_just_tapped !== false;
    const showLevelPercent = this._config?.show_level_percent !== false;
    const abv = typeof tap.abv === "number" ? `${tap.abv}% ABV` : "";
    const style = tap.beverage_style ?? "";
    const beverageColor = this._hexOrNull(tap.beverage_color);
    const details = [tap.location ?? "", abv].filter(Boolean).join(" • ");
    const titleLine = [tap.producer ?? "", tap.beverage ?? ""].filter(Boolean).join(" ");
    const level = this._normalizeLevel(tap.keg_level_percent);
    const color = this._kegColor(level, tap.keg_level_color);
    const fillHeightPercent = `${level}%`;
    const logoKey = `${tap.tap_number ?? "x"}|${tap.logo_url ?? ""}`;
    const hasLogo = Boolean(tap.logo_url) && !this._brokenLogos[logoKey];
    const rowClasses = `${showTapNumber ? "" : "no-tap-number"} ${showLogos ? "" : "no-logo"} ${showKeg ? "" : "no-keg"}`.trim();

    return html`
      <div class="row ${rowClasses}">
        ${showTapNumber ? html`<div class="tap-number">${tap.tap_number ?? "?"}</div>` : nothing}

        ${showLogos
          ? hasLogo
            ? html`<img
                class="logo"
                src="${tap.logo_url}"
                alt="${tap.producer ?? "Producer"}"
                loading="lazy"
                @error=${() => this._markLogoBroken(logoKey)}
              />`
            : html`<div class="logo logo-placeholder" aria-hidden="true"></div>`
          : nothing}

        <div class="info">
          <div class="title-line" title=${titleLine}>
            <span class="producer">${tap.producer ?? "Unknown producer"}</span>
            <span class="beverage">${tap.beverage ?? "Unknown beverage"}</span>
          </div>
          ${showStyle
            ? html`<div class="meta style-line">
                <span
                  class="beverage-color"
                  style=${beverageColor ? `background:${beverageColor}` : ""}
                  aria-hidden="true"
                ></span>
                <span class="style-text" title=${style || "Unknown style"}>${style || "Unknown style"}</span>
              </div>`
            : nothing}
          ${showDetails
            ? html`<div class="meta" title=${details || "Unknown location"}>${details || "Unknown location"}</div>`
            : nothing}
        </div>

        ${showKeg
          ? html`<div class="right-col">
              <div class="keg-visual" role="img" aria-label="Keg level ${level}%">
                <img class="keg-bottom" src="${KEG_BOTTOM_IMAGE}" alt="" />
                <div class="keg-fill-mask">
                  <div class="keg-fill" style="height:${fillHeightPercent};background:${color}"></div>
                </div>
                <img class="keg-front" src="${KEG_FRONT_IMAGE}" alt="" />
                ${showJustTapped && tap.just_tapped ? html`<span class="keg-badge">Just Tapped</span>` : nothing}
              </div>
              ${showLevelPercent ? html`<div class="level">${level}%</div>` : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  protected _renderError(message: string): TemplateResult {
    return html`
      <ha-card>
        <div class="wrapper error">${message}</div>
      </ha-card>
    `;
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): Record<string, number> {
    return {
      rows: 6,
      columns: 12,
      min_rows: 3,
      max_rows: 12
    };
  }

  private _normalizeLevel(value: number | null | undefined): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private _tapSort(a?: string, b?: string): number {
    const aNum = Number.parseInt(a ?? "", 10);
    const bNum = Number.parseInt(b ?? "", 10);
    if (Number.isNaN(aNum) && Number.isNaN(bNum)) return (a ?? "").localeCompare(b ?? "");
    if (Number.isNaN(aNum)) return 1;
    if (Number.isNaN(bNum)) return -1;
    return aNum - bNum;
  }

  private _kegColor(level: number, sourceColor?: string | null): string {
    if (sourceColor && /^#[0-9A-Fa-f]{6}$/.test(sourceColor)) {
      return sourceColor;
    }
    if (level >= 75) return "#22FF28";
    if (level >= 50) return "#B8FF28";
    if (level >= 25) return "#FFE428";
    if (level >= 10) return "#FF8928";
    return "#FF1F28";
  }

  private _hexOrNull(value?: string | null): string | null {
    if (!value) {
      return null;
    }
    return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : null;
  }

  private _markLogoBroken(logoKey: string): void {
    if (this._brokenLogos[logoKey]) {
      return;
    }
    this._brokenLogos = { ...this._brokenLogos, [logoKey]: true };
  }

  static styles = css`
    :host {
      --dp-accent: #ec702a;
      --dp-muted: #5f6368;
      --dp-line: #d7d9dc;
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    .wrapper {
      padding: 12px;
    }

    .header {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 10px;
      color: var(--primary-text-color);
    }

    .list {
      display: grid;
      gap: 10px;
    }

    .row {
      display: grid;
      grid-template-columns: 34px 44px 1fr auto;
      align-items: center;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--dp-line);
    }

    .row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .row.no-logo {
      grid-template-columns: 34px 1fr auto;
    }

    .row.no-keg {
      grid-template-columns: 34px 44px 1fr;
    }

    .row.no-logo.no-keg {
      grid-template-columns: 34px 1fr;
    }

    .row.no-tap-number {
      grid-template-columns: 44px 1fr auto;
    }

    .row.no-tap-number.no-logo {
      grid-template-columns: 1fr auto;
    }

    .row.no-tap-number.no-keg {
      grid-template-columns: 44px 1fr;
    }

    .row.no-tap-number.no-logo.no-keg {
      grid-template-columns: 1fr;
    }

    .tap-number {
      text-align: center;
      font-weight: 700;
      font-size: 1rem;
    }

    .logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--dp-line);
      background: #fff;
    }

    .logo-placeholder {
      display: block;
      background:
        linear-gradient(135deg, #f3f4f6 0%, #ffffff 50%, #eef1f4 100%);
      position: relative;
    }

    .logo-placeholder::after {
      content: "";
      position: absolute;
      inset: 11px;
      border: 2px solid #c4cad1;
      border-radius: 6px;
      transform: rotate(45deg);
    }

    .info {
      min-width: 0;
    }

    .title-line {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .producer {
      font-weight: 600;
      margin-right: 6px;
      color: var(--primary-text-color);
    }

    .beverage {
      color: var(--dp-accent);
      font-weight: 600;
    }

    .meta {
      margin-top: 2px;
      //color: var(--dp-muted);
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .style-line {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .beverage-color {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      border: 1px solid #d8dce1;
      background: transparent;
      flex: 0 0 auto;
    }

    .style-text {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .right-col {
      display: grid;
      justify-items: center;
      gap: 2px;
      min-width: 70px;
    }

    .keg-visual {
      width: 28px;
      height: 46px;
      position: relative;
    }

    .keg-bottom {
      width: 28px;
      height: 46px;
      position: absolute;
      inset: 0;
      object-fit: contain;
    }

    .keg-front {
      width: 28px;
      height: 46px;
      position: absolute;
      inset: 0;
      object-fit: contain;
      opacity: 0.5;
      z-index: 2;
    }

    .keg-fill-mask {
      position: absolute;
      left: 7px;
      bottom: 11px;
      width: 14px;
      height: 26px;
      overflow: hidden;
      border-radius: 2px;
      z-index: 1;
    }

    .keg-fill {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 2px 2px 0 0;
      opacity: 0.75;
      transition: height 240ms ease;
    }

    .keg-badge {
      position: absolute;
      left: -18px;
      top: 18px;
      transform: rotate(-36deg);
      transform-origin: center;
      font-size: 0.45rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-weight: 800;
      color: #744300;
      background: #ffe7c2;
      border: 1px solid #ffd28f;
      border-radius: 999px;
      padding: 1px 4px;
      white-space: nowrap;
      z-index: 3;
      pointer-events: none;
    }

    .level {
      font-size: 0.72rem;
      //color: var(--dp-muted);
      line-height: 1;
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 480px) {
      .row {
        grid-template-columns: 30px 38px 1fr auto;
        gap: 8px;
      }

      .row.no-keg {
        grid-template-columns: 30px 38px 1fr;
      }

      .row.no-logo.no-keg {
        grid-template-columns: 30px 1fr;
      }

      .row.no-tap-number {
        grid-template-columns: 38px 1fr auto;
      }

      .row.no-tap-number.no-logo {
        grid-template-columns: 1fr auto;
      }

      .row.no-tap-number.no-keg {
        grid-template-columns: 38px 1fr;
      }

      .row.no-tap-number.no-logo.no-keg {
        grid-template-columns: 1fr;
      }

      .logo {
        width: 38px;
        height: 38px;
      }

      .keg-visual,
      .keg-bottom,
      .keg-front {
        width: 24px;
        height: 40px;
      }

      .keg-fill-mask {
        left: 6px;
        width: 12px;
        bottom: 10px;
        height: 23px;
      }

      .keg-badge {
        left: -16px;
        top: 15px;
      }
    }
  `;
}

@customElement("digitalpour-card-editor")
class DigitalPourMenuCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: DigitalPourCardConfig;

  public setConfig(config: DigitalPourCardConfig): void {
    this._config = {
      show_title: true,
      show_tap_number: true,
      show_logos: true,
      show_style: true,
      show_details: true,
      show_keg: true,
      show_just_tapped: true,
      show_level_percent: true,
      ...config
    };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="editor">
        <label>
          <span>Entity</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.entity ?? ""}
            .includeDomains=${["sensor"]}
            @value-changed=${(ev: Event) =>
              this._updateValue(
                "entity",
                ((ev as CustomEvent<{ value?: string }>).detail?.value ?? "").trim()
              )}
          ></ha-entity-picker>
        </label>

        <label>
          <span>Title</span>
          <input
            .value=${this._config.title ?? "Current Tap List"}
            @input=${(ev: Event) => this._updateValue("title", (ev.target as HTMLInputElement).value)}
          />
        </label>

        <label>
          <span>Tap Count Limit</span>
          <input
            type="number"
            min="1"
            .value=${String(this._config.max_rows ?? "")}
            @input=${(ev: Event) => this._updateNumber("max_rows", (ev.target as HTMLInputElement).value)}
          />
        </label>

        <fieldset>
          <legend>Display</legend>
          ${this._checkbox("show_title", "Show title")}
          ${this._checkbox("show_tap_number", "Show tap number")}
          ${this._checkbox("show_logos", "Show logos")}
          ${this._checkbox("show_style", "Show style line")}
          ${this._checkbox("show_details", "Show location/abv line")}
          ${this._checkbox("show_keg", "Show keg indicator")}
          ${this._checkbox("show_level_percent", "Show keg percent")}
          ${this._checkbox("show_just_tapped", "Show Just Tapped badge")}
        </fieldset>
      </div>
    `;
  }

  private _checkbox(key: keyof DigitalPourCardConfig, label: string): TemplateResult {
    return html`
      <label class="check">
        <input
          type="checkbox"
          .checked=${(this._config?.[key] as boolean | undefined) !== false}
          @change=${(ev: Event) => this._updateBoolean(key, (ev.target as HTMLInputElement).checked)}
        />
        <span>${label}</span>
      </label>
    `;
  }

  private _updateValue(key: keyof DigitalPourCardConfig, value: string): void {
    this._emitConfig({ [key]: value.trim() });
  }

  private _updateNumber(key: keyof DigitalPourCardConfig, value: string): void {
    const parsed = Number.parseInt(value, 10);
    this._emitConfig({
      [key]: Number.isNaN(parsed) ? undefined : Math.max(1, parsed)
    });
  }

  private _updateBoolean(key: keyof DigitalPourCardConfig, value: boolean): void {
    this._emitConfig({ [key]: value });
  }

  private _emitConfig(patch: Partial<DigitalPourCardConfig>): void {
    const merged = { ...this._config, ...patch } as DigitalPourCardConfig;
    if (!merged.title) {
      delete merged.title;
    }
    if (!merged.max_rows) {
      delete merged.max_rows;
    }
    this._config = merged;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: merged },
        bubbles: true,
        composed: true
      })
    );
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 12px;
      padding: 8px 0;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 0.9rem;
    }

    ha-entity-picker {
      width: 100%;
    }

    input[type="text"],
    input[type="number"],
    input:not([type]) {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }

    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 10px;
      margin: 0;
      display: grid;
      gap: 8px;
    }

    legend {
      padding: 0 6px;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    .check {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "digitalpour-card": DigitalpourCard;
    "digitalpour-card-editor": DigitalPourMenuCardEditor;
  }

  interface Window {
    customCards?: Array<Record<string, string>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "digitalpour-card",
  name: "DigitalPour Menu Card",
  description: "Display a DigitalPour tap list with keg levels and just-tapped badges"
});
