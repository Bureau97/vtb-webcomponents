import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
let VtbCalculatorPriceElement = class VtbCalculatorPriceElement extends LitElement {
    constructor() {
        super(...arguments);
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.price = 0;
        this.price_type = 'pp';
        this.display_price = false;
        this.display_prices_if_zero = false;
    }
    render() {
        // console.info('VtbCalculatorPriceElement:render');
        const priceRenderer = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.currency
        });
        let priceDisplay = '';
        if (this.display_price && typeof this.display_price == 'boolean') {
            priceDisplay = priceRenderer.format(this.price);
        }
        if (!this.display_price && typeof this.display_price == 'boolean') {
            priceDisplay = '';
        }
        if (this.display_price && typeof this.display_price == 'string') {
            priceDisplay = this.display_price;
        }
        if (this.display_price &&
            typeof this.display_price == 'boolean' &&
            this.price == 0 &&
            !this.display_prices_if_zero) {
            priceDisplay = '';
        }
        return html `
      <div class="price-calculator-element">
        <div class="description">
          <slot></slot>
        </div>
        <div class="price">${priceDisplay} &nbsp;</div>
      </div>
    `;
    }
};
VtbCalculatorPriceElement.styles = css `
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
__decorate([
    property({ type: String })
], VtbCalculatorPriceElement.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorPriceElement.prototype, "currency", void 0);
__decorate([
    property({ type: Number })
], VtbCalculatorPriceElement.prototype, "price", void 0);
__decorate([
    property({ type: String, attribute: 'price-type' })
], VtbCalculatorPriceElement.prototype, "price_type", void 0);
__decorate([
    property({
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
        }
    })
], VtbCalculatorPriceElement.prototype, "display_price", void 0);
__decorate([
    property({
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
        }
    })
], VtbCalculatorPriceElement.prototype, "display_prices_if_zero", void 0);
VtbCalculatorPriceElement = __decorate([
    customElement('vtb-calculator-element')
], VtbCalculatorPriceElement);
export { VtbCalculatorPriceElement };
let VtbCalculatorPriceListElement = class VtbCalculatorPriceListElement extends LitElement {
    constructor() {
        super(...arguments);
        this.calculate_totals = false;
        this.display_totals = false;
        this.display_prices = false;
        this.display_prices_if_zero = false;
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.total_price = 0;
    }
    render() {
        return html `
      <div class="price-calculator-element-list">
        <h3>${this.title}</h3>
        <div class="">
          <slot></slot>
        </div>
      </div>
    `;
    }
};
VtbCalculatorPriceListElement.styles = css `
    :host {
      display: block;
    }
  `;
__decorate([
    property({ type: Boolean, attribute: 'calculate-totals' })
], VtbCalculatorPriceListElement.prototype, "calculate_totals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorPriceListElement.prototype, "display_totals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-prices' })
], VtbCalculatorPriceListElement.prototype, "display_prices", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-zero' })
], VtbCalculatorPriceListElement.prototype, "display_prices_if_zero", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorPriceListElement.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorPriceListElement.prototype, "currency", void 0);
__decorate([
    property({ type: Number, attribute: 'total-price' })
], VtbCalculatorPriceListElement.prototype, "total_price", void 0);
VtbCalculatorPriceListElement = __decorate([
    customElement('vtb-calculator-list')
], VtbCalculatorPriceListElement);
export { VtbCalculatorPriceListElement };
let VtbCalculatorElement = class VtbCalculatorElement extends LitElement {
    constructor() {
        super(...arguments);
        this.calculate_totals = false;
        this.display_totals = false;
        this.display_element_prices = false;
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.total_price = 0;
        this.custom_styles = '';
        // @property({type: Object, attribute: false})
        // elements?: VtbCalculatorData;
        this.elements = [];
        this.groups = ['elements', 'surcharges', 'optionals'];
        this.show_per_participant = false;
    }
    render() {
        let slot_html = '';
        if (this.children.length == 0 && this.elements) {
            slot_html = this._render_elements();
        }
        let custom_styles;
        if (this.custom_styles) {
            custom_styles = html `
                <style type=text/css>${this.custom_styles}</style>
            `;
        }
        return html `
      ${custom_styles}
      <div class="price-calculator">
        <slot>${slot_html}</slot>
        ${this.render_totals()}
      </div>
    `;
    }
    render_totals() {
        if (this.display_totals && this.total_price > 0) {
            return html `
        <div class="price-calculator-totals">
          <vtb-calculator-element
            price=${this.total_price}
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
    render_element_description(element) {
        return `${element.days} dgn. - ${element.title}`;
    }
    get_element_price(element) {
        return `${element.price}`;
    }
    _render_elements() {
        const elements = this.elements;
        if (elements.length >= 1) {
            return html `
        <vtb-calculator-list title=${ifDefined(this.title)}>
          ${this._render_price_list(elements)}
        </vtb-calculator-list>
      `;
        }
        return html `<!-- no elements -->`;
    }
    _render_price_list(price_list) {
        const elementTemplates = [];
        for (const element of price_list) {
            if (element && element.hidden) {
                continue;
            }
            elementTemplates.push(html `
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
};
VtbCalculatorElement.styles = css `
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
__decorate([
    property({ type: Boolean, attribute: 'calculate-totals' })
], VtbCalculatorElement.prototype, "calculate_totals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorElement.prototype, "display_totals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-prices' })
], VtbCalculatorElement.prototype, "display_element_prices", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorElement.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorElement.prototype, "currency", void 0);
__decorate([
    property({ type: Number, attribute: 'total-price' })
], VtbCalculatorElement.prototype, "total_price", void 0);
__decorate([
    property({ type: String, attribute: false })
], VtbCalculatorElement.prototype, "custom_styles", void 0);
__decorate([
    property({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "elements", void 0);
__decorate([
    property({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "groups", void 0);
__decorate([
    property({ type: Boolean, attribute: false })
], VtbCalculatorElement.prototype, "show_per_participant", void 0);
VtbCalculatorElement = __decorate([
    customElement('vtb-calculator')
], VtbCalculatorElement);
export { VtbCalculatorElement };
//# sourceMappingURL=calculator.js.map