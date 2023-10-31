import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {TemplateResult} from 'lit-element';
import {ifDefined} from 'lit/directives/if-defined.js';

import {VtbElement} from '../models';

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
  priceType = 'pp';

  @property({
    type: String,
    attribute: 'display-price',
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
        return value.toString();
      }

      return false;
    },
  })
  displayPrice: boolean | string = false;

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
  displayPricesIfZero = false;

  override render() {
    const priceRenderer = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    });

    let priceDisplay = '';
    if (this.displayPrice && typeof this.displayPrice == 'boolean') {
      priceDisplay = priceRenderer.format(this.price) as string;
    }

    if (!this.displayPrice && typeof this.displayPrice == 'boolean') {
      priceDisplay = '';
    }

    if (this.displayPrice && typeof this.displayPrice == 'string') {
      priceDisplay = this.displayPrice;
    }

    if (
      this.displayPrice &&
      typeof this.displayPrice == 'boolean' &&
      this.price == 0 &&
      !this.displayPricesIfZero
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
  calculateTotals = false;

  @property({type: Boolean, attribute: 'display-totals'})
  displayTotals = false;

  @property({type: Boolean, attribute: false})
  displayPrices = false;

  @property({type: Boolean, attribute: 'display-zero'})
  displayPricesIfZero = false;

  @property({type: String})
  locale = 'nl-NL';

  @property({type: String})
  currency = 'EUR';

  @property({type: Number, attribute: 'total-price'})
  totalPrice = 0;

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
  calculateTotals = false;

  @property({type: Boolean, attribute: 'display-totals'})
  displayTotals = false;

  @property({type: String})
  locale = 'nl-NL';

  @property({type: String})
  currency = 'EUR';

  @property({type: Number, attribute: 'total-price'})
  totalPrice = 0;

  @property({type: String, attribute: false})
  customStyles = '';

  // @property({type: Object, attribute: false})
  // priceData?: VtbCalculatorData;

  @property({type: Array, attribute: false})
  priceData?: Array<VtbElement>;

  @property({type: Array, attribute: false})
  groups = ['elements', 'surcharges', 'optionals'];

  @property({type: Boolean, attribute: false})
  showPerParticipant = false;

  override render() {
    let slotHTML: string | TemplateResult = '';

    if (this.children.length == 0 && this.priceData) {
      slotHTML = this._renderPriceData();
    }

    let customStyles;
    if (this.customStyles) {
      customStyles = html`
                <style type=text/css>${this.customStyles}</style>
            `;
    }

    return html`
      ${customStyles}
      <div class="price-calculator">
        <slot>${slotHTML}</slot>
        ${this.renderTotals()}
      </div>
    `;
  }

  private renderTotals() {
    if (this.displayTotals) {
      return html`
        <div class="price-calculator-totals">
          <vtb-calculator-element
            price=${this.totalPrice}
            currency=${this.currency}
            locale=${this.locale}
            display-price="true"
          >
            Totaal
          </vtb-calculator-element>
        </div>
      `;
    }
    return '';
  }

  public renderElementDescription(element: VtbElement) {
    return `${element.nights + 1} dgn. - ${element.title}`;
  }

  public getElementPrice(element: VtbElement) {
    return `${element.price}`;
  }

  private _renderPriceData() {
    const priceData = this.priceData as Array<VtbElement>;
    return html`
      <vtb-calculator-list title=${ifDefined(this.title)}>
        ${this._renderPriceList(priceData)}
      </vtb-calculator-list>
    `;
  }

  private _renderPriceList(priceList: Array<VtbElement>) {
    const elementTemplates: Array<TemplateResult> = [];

    for (const element of priceList) {
      if (element && element.hidden) {
        continue;
      }

      elementTemplates.push(html`
        <vtb-calculator-element
          price=${this.getElementPrice(element)}
          currency=${this.currency}
          price-type=""
          display-price="true"
        >
          ${this.renderElementDescription(element)}
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
