var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
dayjs.locale('nl');
import * as _ from 'lodash';
const { isEqual } = _;
class VtbBaseFlightElement extends LitElement {
    constructor() {
        super(...arguments);
        this.timezone = '02:00';
        this.dateformat = 'DD MMM (hh:mm)';
        this.type = 'departure';
    }
    render() {
        const date = dayjs(this.date);
        if (!this.dateformat || this.dateformat == '') {
            return html `
        <div class="row ${this.type}">
          <div class="date-time"></div>
          <div class="description"><slot></slot></div>
        </div>
      `;
        }
        else {
            return html `
        <div class="row ${this.type}">
          <div class="date-time">${date.format(this.dateformat)}</div>
          <div class="description"><slot></slot></div>
        </div>
      `;
        }
    }
}
VtbBaseFlightElement.styles = css `
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
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "IATA", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "date", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "time", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "timezone", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "dateformat", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "country", void 0);
__decorate([
    property({ type: String })
], VtbBaseFlightElement.prototype, "city", void 0);
let VtbFlightDepartureElement = class VtbFlightDepartureElement extends VtbBaseFlightElement {
    constructor() {
        super(...arguments);
        this.type = 'departure';
    }
};
VtbFlightDepartureElement = __decorate([
    customElement('vtb-flight-departure')
], VtbFlightDepartureElement);
export { VtbFlightDepartureElement };
let VtbFlightArrivalElement = class VtbFlightArrivalElement extends VtbBaseFlightElement {
    constructor() {
        super(...arguments);
        this.type = 'arrival';
    }
};
VtbFlightArrivalElement = __decorate([
    customElement('vtb-flight-arrival')
], VtbFlightArrivalElement);
export { VtbFlightArrivalElement };
let VtbFlightElement = class VtbFlightElement extends LitElement {
    render() {
        return html `
      <div class="flight">
        <slot></slot>
        ${this.render_carrier()} ${this.render_duration()}
        ${this.render_flightnumber()}
      </div>
    `;
    }
    render_carrier() {
        if (this.carrier) {
            return html `<div class="carrier">${this.carrier}</div>`;
        }
        return '';
    }
    render_duration() {
        if (this.duration) {
            return html `<div class="duration">${this.duration}</div>`;
        }
        return '';
    }
    render_flightnumber() {
        if (this.flightnumber) {
            return html `<div class="flightnumber">
        ${this.carrier_code}${this.flightnumber}
      </div>`;
        }
        return '';
    }
};
VtbFlightElement.styles = css `
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
__decorate([
    property({ type: String })
], VtbFlightElement.prototype, "flightnumber", void 0);
__decorate([
    property({ type: String })
], VtbFlightElement.prototype, "carrier", void 0);
__decorate([
    property({ type: String })
], VtbFlightElement.prototype, "carrier_code", void 0);
__decorate([
    property({ type: String })
], VtbFlightElement.prototype, "duration", void 0);
VtbFlightElement = __decorate([
    customElement('vtb-flight-element')
], VtbFlightElement);
export { VtbFlightElement };
let VtbFlightScheduleElement = class VtbFlightScheduleElement extends LitElement {
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
        return html `
      <div class="flight-schedule">
        <slot>${_innerHTML}</slot>
      </div>
    `;
    }
    _renderFlightInfo() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const flightinfo = this.flightinfo;
        const scheduleTemplates = [];
        for (const _schedule of flightinfo) {
            let departure_date = null;
            let arrival_date = null;
            if (((_a = _schedule.departure) === null || _a === void 0 ? void 0 : _a.date) &&
                typeof ((_b = _schedule.departure) === null || _b === void 0 ? void 0 : _b.date) == 'string') {
                departure_date = dayjs((_c = _schedule.departure) === null || _c === void 0 ? void 0 : _c.date);
            }
            else {
                departure_date = (_d = _schedule.departure) === null || _d === void 0 ? void 0 : _d.date;
            }
            if (((_e = _schedule.arrival) === null || _e === void 0 ? void 0 : _e.date) &&
                typeof ((_f = _schedule.arrival) === null || _f === void 0 ? void 0 : _f.date) == 'string') {
                arrival_date = dayjs((_g = _schedule.arrival) === null || _g === void 0 ? void 0 : _g.date);
            }
            else {
                arrival_date = (_h = _schedule.arrival) === null || _h === void 0 ? void 0 : _h.date;
            }
            scheduleTemplates.push(html `
        <vtb-flight-element
          carrier=${ifDefined((_j = _schedule.carrier) === null || _j === void 0 ? void 0 : _j.name)}
          carrier_code=${ifDefined((_k = _schedule.carrier) === null || _k === void 0 ? void 0 : _k.code)}
          duration=${ifDefined(_schedule.duration)}
          flightnumber=${ifDefined(_schedule.flightnumber)}
        >
          <vtb-flight-departure
            date=${ifDefined(departure_date === null || departure_date === void 0 ? void 0 : departure_date.format('YYYY-MM-DD HH:mm'))}
            IATA=${ifDefined((_l = _schedule.departure) === null || _l === void 0 ? void 0 : _l.IATA)}
            dateformat=${this.dateformat}
            country=${ifDefined((_m = _schedule.departure) === null || _m === void 0 ? void 0 : _m.country)}
            city=${ifDefined((_o = _schedule.departure) === null || _o === void 0 ? void 0 : _o.city)}
            timezone=${ifDefined((_p = _schedule.departure) === null || _p === void 0 ? void 0 : _p.timezone)}
          >
            ${ifDefined((_q = _schedule.departure) === null || _q === void 0 ? void 0 : _q.description)}
          </vtb-flight-departure>
          <vtb-flight-arrival
            date=${ifDefined(arrival_date === null || arrival_date === void 0 ? void 0 : arrival_date.format('YYYY-MM-DD HH:mm'))}
            IATA=${ifDefined((_r = _schedule.arrival) === null || _r === void 0 ? void 0 : _r.IATA)}
            dateformat=${this.dateformat}
            country=${ifDefined((_s = _schedule.arrival) === null || _s === void 0 ? void 0 : _s.country)}
            city=${ifDefined((_t = _schedule.arrival) === null || _t === void 0 ? void 0 : _t.city)}
            timezone=${ifDefined((_u = _schedule.arrival) === null || _u === void 0 ? void 0 : _u.timezone)}
          >
            ${ifDefined((_v = _schedule.arrival) === null || _v === void 0 ? void 0 : _v.description)}
          </vtb-flight-arrival>
        </vtb-flight-element>
      `);
        }
        return html `${scheduleTemplates}`;
    }
};
__decorate([
    property({
        type: Array,
        attribute: false,
        hasChanged(newVal, oldVal) {
            return !isEqual(newVal, oldVal);
        },
    })
], VtbFlightScheduleElement.prototype, "flightinfo", void 0);
__decorate([
    property({ type: String })
], VtbFlightScheduleElement.prototype, "dateformat", void 0);
VtbFlightScheduleElement = __decorate([
    customElement('vtb-flightschedule')
], VtbFlightScheduleElement);
export { VtbFlightScheduleElement };
//# sourceMappingURL=flightschedule.js.map