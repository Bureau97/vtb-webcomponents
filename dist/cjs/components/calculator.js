"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtbCalculatorElement = exports.VtbCalculatorPriceListElement = exports.VtbCalculatorPriceElement = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const if_defined_js_1 = require("lit/directives/if-defined.js");
let VtbCalculatorPriceElement = class VtbCalculatorPriceElement extends lit_1.LitElement {
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
        return (0, lit_1.html) `
      <div class="price-calculator-element">
        <div class="description">
          <slot></slot>
        </div>
        <div class="price">${priceDisplay} &nbsp;</div>
      </div>
    `;
    }
};
exports.VtbCalculatorPriceElement = VtbCalculatorPriceElement;
VtbCalculatorPriceElement.styles = (0, lit_1.css) `
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
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorPriceElement.prototype, "locale", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorPriceElement.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Number })
], VtbCalculatorPriceElement.prototype, "price", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String, attribute: 'price-type' })
], VtbCalculatorPriceElement.prototype, "priceType", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({
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
tslib_1.__decorate([
    (0, decorators_js_1.property)({
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
exports.VtbCalculatorPriceElement = VtbCalculatorPriceElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-calculator-element')
], VtbCalculatorPriceElement);
let VtbCalculatorPriceListElement = class VtbCalculatorPriceListElement extends lit_1.LitElement {
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
        return (0, lit_1.html) `
      <div class="price-calculator-element-list">
        <h3>${this.title}</h3>
        <div class="">
          <slot></slot>
        </div>
      </div>
    `;
    }
};
exports.VtbCalculatorPriceListElement = VtbCalculatorPriceListElement;
VtbCalculatorPriceListElement.styles = (0, lit_1.css) `
    :host {
      display: block;
    }
  `;
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'calculate-totals' })
], VtbCalculatorPriceListElement.prototype, "calculateTotals", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorPriceListElement.prototype, "displayTotals", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: false })
], VtbCalculatorPriceListElement.prototype, "displayPrices", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'display-zero' })
], VtbCalculatorPriceListElement.prototype, "displayPricesIfZero", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorPriceListElement.prototype, "locale", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorPriceListElement.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Number, attribute: 'total-price' })
], VtbCalculatorPriceListElement.prototype, "totalPrice", void 0);
exports.VtbCalculatorPriceListElement = VtbCalculatorPriceListElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-calculator-list')
], VtbCalculatorPriceListElement);
let VtbCalculatorElement = class VtbCalculatorElement extends lit_1.LitElement {
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
            customStyles = (0, lit_1.html) `
                <style type=text/css>${this.customStyles}</style>
            `;
        }
        return (0, lit_1.html) `
      ${customStyles}
      <div class="price-calculator">
        <slot>${slotHTML}</slot>
        ${this.renderTotals()}
      </div>
    `;
    }
    renderTotals() {
        if (this.displayTotals) {
            return (0, lit_1.html) `
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
        return (0, lit_1.html) `
      <vtb-calculator-list title=${(0, if_defined_js_1.ifDefined)(this.title)}>
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
            elementTemplates.push((0, lit_1.html) `
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
exports.VtbCalculatorElement = VtbCalculatorElement;
VtbCalculatorElement.styles = (0, lit_1.css) `
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
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'calculate-totals' })
], VtbCalculatorElement.prototype, "calculateTotals", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'display-totals' })
], VtbCalculatorElement.prototype, "displayTotals", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorElement.prototype, "locale", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbCalculatorElement.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Number, attribute: 'total-price' })
], VtbCalculatorElement.prototype, "totalPrice", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String, attribute: false })
], VtbCalculatorElement.prototype, "customStyles", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "priceData", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Array, attribute: false })
], VtbCalculatorElement.prototype, "groups", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: false })
], VtbCalculatorElement.prototype, "showPerParticipant", void 0);
exports.VtbCalculatorElement = VtbCalculatorElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-calculator')
], VtbCalculatorElement);
//# sourceMappingURL=calculator.js.map