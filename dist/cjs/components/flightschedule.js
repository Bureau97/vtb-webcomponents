"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtbFlightScheduleElement = exports.VtbFlightElement = exports.VtbFlightArrivalElement = exports.VtbFlightDepartureElement = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const if_defined_js_1 = require("lit/directives/if-defined.js");
const dayjs_1 = require("dayjs");
require("dayjs/locale/nl.js");
dayjs_1.default.locale('nl');
const _ = require("lodash");
const { isEqual } = _;
class VtbBaseFlightElement extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.timezone = '02:00';
        this.dateformat = 'DD MMM (hh:mm)';
        this.type = 'departure';
    }
    render() {
        const date = (0, dayjs_1.default)(this.date);
        if (!this.dateformat || this.dateformat == '') {
            return (0, lit_1.html) `
        <div class="row ${this.type}">
          <div class="date-time"></div>
          <div class="description"><slot></slot></div>
        </div>
      `;
        }
        else {
            return (0, lit_1.html) `
        <div class="row ${this.type}">
          <div class="date-time">${date.format(this.dateformat)}</div>
          <div class="description"><slot></slot></div>
        </div>
      `;
        }
    }
}
VtbBaseFlightElement.styles = (0, lit_1.css) `
    :host {
      width: 100%;
    }

    .row > div {
      display: inline-block;
    }

    .date,
    .time,
    .description,
    .carrier {
      padding: 0 1rem;
    }
  `;
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "IATA", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "date", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "time", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "timezone", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "dateformat", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "country", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbBaseFlightElement.prototype, "city", void 0);
let VtbFlightDepartureElement = class VtbFlightDepartureElement extends VtbBaseFlightElement {
    constructor() {
        super(...arguments);
        this.type = 'departure';
    }
};
exports.VtbFlightDepartureElement = VtbFlightDepartureElement;
exports.VtbFlightDepartureElement = VtbFlightDepartureElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-flight-departure')
], VtbFlightDepartureElement);
let VtbFlightArrivalElement = class VtbFlightArrivalElement extends VtbBaseFlightElement {
    constructor() {
        super(...arguments);
        this.type = 'arrival';
    }
};
exports.VtbFlightArrivalElement = VtbFlightArrivalElement;
exports.VtbFlightArrivalElement = VtbFlightArrivalElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-flight-arrival')
], VtbFlightArrivalElement);
let VtbFlightElement = class VtbFlightElement extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `
      <div class="flight">
        <slot></slot>
        ${this.render_carrier()} ${this.render_duration()}
        ${this.render_flightnumber()}
      </div>
    `;
    }
    render_carrier() {
        if (this.carrier) {
            return (0, lit_1.html) `<div class="carrier">${this.carrier}</div>`;
        }
        return '';
    }
    render_duration() {
        if (this.duration) {
            return (0, lit_1.html) `<div class="duration">${this.duration}</div>`;
        }
        return '';
    }
    render_flightnumber() {
        if (this.flightnumber) {
            return (0, lit_1.html) `<div class="flightnumber">
        ${this.carrier_code}${this.flightnumber}
      </div>`;
        }
        return '';
    }
};
exports.VtbFlightElement = VtbFlightElement;
VtbFlightElement.styles = (0, lit_1.css) `
    :host {
      width: 100%;
    }

    .flight {
      display: grid;
      grid-template-columns: 3fr 3fr 1fr 1fr 1fr;
      column-gap: 0.5rem;
      row-gap: 0.5rem;
    }
  `;
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbFlightElement.prototype, "flightnumber", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbFlightElement.prototype, "carrier", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbFlightElement.prototype, "carrier_code", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbFlightElement.prototype, "duration", void 0);
exports.VtbFlightElement = VtbFlightElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-flight-element')
], VtbFlightElement);
let VtbFlightScheduleElement = class VtbFlightScheduleElement extends lit_1.LitElement {
    constructor() {
        super();
        this.flightinfo = [];
        this.dateformat = 'DD MMM (hh:mm)';
        this.flightinfo = [];
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        let _innerHTML = '';
        if (this.children.length == 0 && this.flightinfo) {
            _innerHTML = this._renderFlightInfo();
        }
        return (0, lit_1.html) `
      <div class="flight-schedule">
        <slot>${_innerHTML}</slot>
      </div>
    `;
    }
    _renderFlightInfo() {
        const flightinfo = this.flightinfo;
        const scheduleTemplates = [];
        for (const _schedule of flightinfo) {
            let departure_date = null;
            let arrival_date = null;
            if (_schedule.departure?.date &&
                typeof _schedule.departure?.date == 'string') {
                departure_date = (0, dayjs_1.default)(_schedule.departure?.date);
            }
            else {
                departure_date = _schedule.departure?.date;
            }
            if (_schedule.arrival?.date &&
                typeof _schedule.arrival?.date == 'string') {
                arrival_date = (0, dayjs_1.default)(_schedule.arrival?.date);
            }
            else {
                arrival_date = _schedule.arrival?.date;
            }
            scheduleTemplates.push((0, lit_1.html) `
        <vtb-flight-element
          carrier=${(0, if_defined_js_1.ifDefined)(_schedule.carrier?.name)}
          carrier_code=${(0, if_defined_js_1.ifDefined)(_schedule.carrier?.code)}
          duration=${(0, if_defined_js_1.ifDefined)(_schedule.duration)}
          flightnumber=${(0, if_defined_js_1.ifDefined)(_schedule.flightnumber)}
        >
          <vtb-flight-departure
            date=${(0, if_defined_js_1.ifDefined)(departure_date?.format('YYYY-MM-DD HH:mm'))}
            IATA=${(0, if_defined_js_1.ifDefined)(_schedule.departure?.IATA)}
            dateformat=${this.dateformat}
            country=${(0, if_defined_js_1.ifDefined)(_schedule.departure?.country)}
            city=${(0, if_defined_js_1.ifDefined)(_schedule.departure?.city)}
            timezone=${(0, if_defined_js_1.ifDefined)(_schedule.departure?.timezone)}
          >
            ${(0, if_defined_js_1.ifDefined)(_schedule.departure?.description)}
          </vtb-flight-departure>
          <vtb-flight-arrival
            date=${(0, if_defined_js_1.ifDefined)(arrival_date?.format('YYYY-MM-DD HH:mm'))}
            IATA=${(0, if_defined_js_1.ifDefined)(_schedule.arrival?.IATA)}
            dateformat=${this.dateformat}
            country=${(0, if_defined_js_1.ifDefined)(_schedule.arrival?.country)}
            city=${(0, if_defined_js_1.ifDefined)(_schedule.arrival?.city)}
            timezone=${(0, if_defined_js_1.ifDefined)(_schedule.arrival?.timezone)}
          >
            ${(0, if_defined_js_1.ifDefined)(_schedule.arrival?.description)}
          </vtb-flight-arrival>
        </vtb-flight-element>
      `);
        }
        return (0, lit_1.html) `${scheduleTemplates}`;
    }
};
exports.VtbFlightScheduleElement = VtbFlightScheduleElement;
tslib_1.__decorate([
    (0, decorators_js_1.property)({
        type: Array,
        attribute: false,
        hasChanged(newVal, oldVal) {
            return !isEqual(newVal, oldVal);
        },
    })
], VtbFlightScheduleElement.prototype, "flightinfo", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String })
], VtbFlightScheduleElement.prototype, "dateformat", void 0);
exports.VtbFlightScheduleElement = VtbFlightScheduleElement = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('vtb-flightschedule')
], VtbFlightScheduleElement);
//# sourceMappingURL=flightschedule.js.map