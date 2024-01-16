import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {TemplateResult} from 'lit-element';
import {ifDefined} from 'lit/directives/if-defined.js';

import {VtbElement} from '../models.js';

@customElement('vtb-calculator-element')
export class VtbCalculatorPriceElement extends LitElement {
  static override styles = css`
    .price-calculator-element:after {
      content: '';
      display: block;
      clear: both;
    }

    .price-calculator-element > div {
      float: left;
    }

    .description {
      width: 70%;
    }

    .price {
      width: 30%;
      text-align: right;
    }

    h3 {
      display: block;
    }
  `;

  @property({type: String})
  locale = 'nl-NL';

  @property({type: String})
  currency = 'EUR';

  @property({type: Number})
  price = 0;

  @property({type: String, attribute: 'price-type'})
  price_type = 'pp';

  @property({
    type: String,
    attribute: 'display-price',
    converter: (value, _type) => {
      // console.info('value', value, typeof value);
      // console.info('type', _type);

      if (typeof value == 'string' && value == 'true') {
        return true;
      }

      if (typeof value == 'string' && value == 'false') {
        return false;
      }

      if (typeof value == 'boolean') {
        return value;
      }

      if (value) {
        return value.toString();
      }

      return false;
    },
  })
  display_price: boolean | string = false;

  @property({
    type: Boolean,
    attribute: 'display-zero',
    converter: (value, _type) => {
      if (typeof value == 'string' && value == 'true') {
        return true;
      }

      if (typeof value == 'string' && value == 'false') {
        return false;
      }

      if (typeof value == 'boolean') {
        return value;
      }

      if (value) {
        return true;
      }

      return false;
    },
  })
  display_prices_if_zero = false;

  override render() {
    // console.info('VtbCalculatorPriceElement:render');
    const priceRenderer = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    });

    let priceDisplay = '';
    if (this.display_price && typeof this.display_price == 'boolean') {
      priceDisplay = priceRenderer.format(this.price) as string;
    }

    if (!this.display_price && typeof this.display_price == 'boolean') {
      priceDisplay = '';
    }

    if (this.display_price && typeof this.display_price == 'string') {
      priceDisplay = this.display_price;
    }

    if (
      this.display_price &&
      typeof this.display_price == 'boolean' &&
      this.price == 0 &&
      !this.display_prices_if_zero
    ) {
      priceDisplay = '';
    }

    return html`
      <div class="price-calculator-element">
        <div class="description">
          <slot></slot>
        </div>
        <div class="price">${priceDisplay} &nbsp;</div>
      </div>
    `;
  }
}

@customElement('vtb-calculator-list')
export class VtbCalculatorPriceListElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({type: Boolean, attribute: 'calculate-totals'})
  calculate_totals = false;

  @property({type: Boolean, attribute: 'display-totals'})
  display_totals = false;

  @property({ type: Boolean, attribute: 'display-prices' })
  display_prices = false;

  @property({type: Boolean, attribute: 'display-zero'})
  display_prices_if_zero = false;

  @property({type: String})
  locale = 'nl-NL';

  @property({type: String})
  currency = 'EUR';

  @property({type: Number, attribute: 'total-price'})
  total_price = 0;

  override render() {
    return html`
      <div class="price-calculator-element-list">
        <h3>${this.title}</h3>
        <div class="">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

@customElement('vtb-calculator')
export class VtbCalculatorElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .price-calculator-totals {
      font-weight: bold;
      font-size: 110%;
      border-top: 1px solid #444;
      margin-top: 1rem;
      padding-top: 1rem;
    }
  `;

  @property({type: Boolean, attribute: 'calculate-totals'})
  calculate_totals = false;

  @property({type: Boolean, attribute: 'display-totals'})
  display_totals = false;

  @property({ type: Boolean, attribute: 'display-prices' })
  display_element_prices = false;

  @property({type: String})
  locale = 'nl-NL';

  @property({type: String})
  currency = 'EUR';

  @property({type: Number, attribute: 'total-price'})
  total_price = 0;

  @property({type: String, attribute: false})
  custom_styles = '';

  // @property({type: Object, attribute: false})
  // elements?: VtbCalculatorData;

  @property({type: Array, attribute: false})
  elements: Array<VtbElement> = [];

  @property({type: Array, attribute: false})
  groups = ['elements', 'surcharges', 'optionals'];

  @property({type: Boolean, attribute: false})
  show_per_participant = false;

  override render() {
    let slot_html: string | TemplateResult = '';

    if (this.children.length == 0 && this.elements) {
      slot_html = this._render_elements();
    }

    let custom_styles;
    if (this.custom_styles) {
      custom_styles = html`
                <style type=text/css>${this.custom_styles}</style>
            `;
    }

    return html`
      ${custom_styles}
      <div class="price-calculator">
        <slot>${slot_html}</slot>
        ${this.render_totals()}
      </div>
    `;
  }

  private render_totals() {
    if (this.display_totals && this.total_price > 0) {
      return html`
        <div class="price-calculator-totals">
          <vtb-calculator-element
            price=${this.total_price}
            currency=${this.currency}
            locale=${this.locale}
            display-price=true
          >
            Totaal
          </vtb-calculator-element>
        </div>
      `;
    }
    return '';
  }

  public render_element_description(element: VtbElement) {
    return `${element.days} dgn. - ${element.title}`;
  }

  public get_element_price(element: VtbElement) {
    return `${element.price}`;
  }

  private _render_elements() {
    const elements = this.elements as Array<VtbElement>;

    if (elements.length >= 1) {
      return html`
        <vtb-calculator-list title=${ifDefined(this.title)}>
          ${this._render_price_list(elements)}
        </vtb-calculator-list>
      `;
    }

    return html`<!-- no elements -->`;
  }

  private _render_price_list(price_list: Array<VtbElement>) {
    const elementTemplates: Array<TemplateResult> = [];

    for (const element of price_list) {
      if (element && element.hidden) {
        continue;
      }

      elementTemplates.push(html`
        <vtb-calculator-element
          price=${parseFloat(this.get_element_price(element))}
          currency=${this.currency}
          locale=${this.locale}
          display-price=${this.display_element_prices}
        >
          ${this.render_element_description(element)}
        </vtb-calculator-element>
      `);
    }

    return elementTemplates;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-calculator': VtbCalculatorElement;
    'vtb-calculator-list': VtbCalculatorPriceListElement;
    'vtb-calculator-element': VtbCalculatorPriceElement;
  }
}
