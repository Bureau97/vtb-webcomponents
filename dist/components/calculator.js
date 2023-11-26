var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
let VtbCalculatorPriceElement = class VtbCalculatorPriceElement extends LitElement {
    constructor() {
        super(...arguments);
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.price = 0;
        this.priceType = 'pp';
        this.displayPrice = false;
        this.displayPricesIfZero = false;
    }
    render() {
        const priceRenderer = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.currency,
        });
        let priceDisplay = '';
        if (this.displayPrice && typeof this.displayPrice == 'boolean') {
            priceDisplay = priceRenderer.format(this.price);
        }
        if (!this.displayPrice && typeof this.displayPrice == 'boolean') {
            priceDisplay = '';
        }
        if (this.displayPrice && typeof this.displayPrice == 'string') {
            priceDisplay = this.displayPrice;
        }
        if (this.displayPrice &&
            typeof this.displayPrice == 'boolean' &&
            this.price == 0 &&
            !this.displayPricesIfZero) {
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
], VtbCalculatorPriceElement.prototype, "priceType", void 0);
__decorate([
    property({
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
], VtbCalculatorPriceElement.prototype, "displayPrice", void 0);
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
        },
    })
], VtbCalculatorPriceElement.prototype, "displayPricesIfZero", void 0);
VtbCalculatorPriceElement = __decorate([
    customElement('vtb-calculator-element')
], VtbCalculatorPriceElement);
export { VtbCalculatorPriceElement };
let VtbCalculatorPriceListElement = class VtbCalculatorPriceListElement extends LitElement {
    constructor() {
        super(...arguments);
        this.calculateTotals = false;
        this.displayTotals = false;
        this.displayPrices = false;
        this.displayPricesIfZero = false;
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.totalPrice = 0;
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
], VtbCalculatorPriceListElement.prototype, "calculateTotals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorPriceListElement.prototype, "displayTotals", void 0);
__decorate([
    property({ type: Boolean, attribute: false })
], VtbCalculatorPriceListElement.prototype, "displayPrices", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-zero' })
], VtbCalculatorPriceListElement.prototype, "displayPricesIfZero", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorPriceListElement.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorPriceListElement.prototype, "currency", void 0);
__decorate([
    property({ type: Number, attribute: 'total-price' })
], VtbCalculatorPriceListElement.prototype, "totalPrice", void 0);
VtbCalculatorPriceListElement = __decorate([
    customElement('vtb-calculator-list')
], VtbCalculatorPriceListElement);
export { VtbCalculatorPriceListElement };
let VtbCalculatorElement = class VtbCalculatorElement extends LitElement {
    constructor() {
        super(...arguments);
        this.calculateTotals = false;
        this.displayTotals = false;
        this.locale = 'nl-NL';
        this.currency = 'EUR';
        this.totalPrice = 0;
        this.customStyles = '';
        this.groups = ['elements', 'surcharges', 'optionals'];
        this.showPerParticipant = false;
    }
    render() {
        let slotHTML = '';
        if (this.children.length == 0 && this.priceData) {
            slotHTML = this._renderPriceData();
        }
        let customStyles;
        if (this.customStyles) {
            customStyles = html `
                <style type=text/css>${this.customStyles}</style>
            `;
        }
        return html `
      ${customStyles}
      <div class="price-calculator">
        <slot>${slotHTML}</slot>
        ${this.renderTotals()}
      </div>
    `;
    }
    renderTotals() {
        if (this.displayTotals) {
            return html `
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
    renderElementDescription(element) {
        return `${element.nights + 1} dgn. - ${element.title}`;
    }
    getElementPrice(element) {
        return `${element.price}`;
    }
    _renderPriceData() {
        const priceData = this.priceData;
        return html `
      <vtb-calculator-list title=${ifDefined(this.title)}>
        ${this._renderPriceList(priceData)}
      </vtb-calculator-list>
    `;
    }
    _renderPriceList(priceList) {
        const elementTemplates = [];
        for (const element of priceList) {
            if (element && element.hidden) {
                continue;
            }
            elementTemplates.push(html `
        <vtb-calculator-element
          price=${parseFloat(this.getElementPrice(element))}
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
], VtbCalculatorElement.prototype, "calculateTotals", void 0);
__decorate([
    property({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorElement.prototype, "displayTotals", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorElement.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], VtbCalculatorElement.prototype, "currency", void 0);
__decorate([
    property({ type: Number, attribute: 'total-price' })
], VtbCalculatorElement.prototype, "totalPrice", void 0);
__decorate([
    property({ type: String, attribute: false })
], VtbCalculatorElement.prototype, "customStyles", void 0);
__decorate([
    property({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "priceData", void 0);
__decorate([
    property({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "groups", void 0);
__decorate([
    property({ type: Boolean, attribute: false })
], VtbCalculatorElement.prototype, "showPerParticipant", void 0);
VtbCalculatorElement = __decorate([
    customElement('vtb-calculator')
], VtbCalculatorElement);
export { VtbCalculatorElement };
//# sourceMappingURL=calculator.js.map