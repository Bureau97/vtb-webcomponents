import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import dayjs from 'dayjs';
import 'dayjs/locale/nl.js';
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
        const flightinfo = this.flightinfo;
        const scheduleTemplates = [];
        for (const _schedule of flightinfo) {
            let departure_date = null;
            let arrival_date = null;
            if (_schedule.departure?.date &&
                typeof _schedule.departure?.date == 'string') {
                departure_date = dayjs(_schedule.departure?.date);
            }
            else {
                departure_date = _schedule.departure?.date;
            }
            if (_schedule.arrival?.date &&
                typeof _schedule.arrival?.date == 'string') {
                arrival_date = dayjs(_schedule.arrival?.date);
            }
            else {
                arrival_date = _schedule.arrival?.date;
            }
            scheduleTemplates.push(html `
        <vtb-flight-element
          carrier=${ifDefined(_schedule.carrier?.name)}
          carrier_code=${ifDefined(_schedule.carrier?.code)}
          duration=${ifDefined(_schedule.duration)}
          flightnumber=${ifDefined(_schedule.flightnumber)}
        >
          <vtb-flight-departure
            date=${ifDefined(departure_date?.format('YYYY-MM-DD HH:mm'))}
            IATA=${ifDefined(_schedule.departure?.IATA)}
            dateformat=${this.dateformat}
            country=${ifDefined(_schedule.departure?.country)}
            city=${ifDefined(_schedule.departure?.city)}
            timezone=${ifDefined(_schedule.departure?.timezone)}
          >
            ${ifDefined(_schedule.departure?.description)}
          </vtb-flight-departure>
          <vtb-flight-arrival
            date=${ifDefined(arrival_date?.format('YYYY-MM-DD HH:mm'))}
            IATA=${ifDefined(_schedule.arrival?.IATA)}
            dateformat=${this.dateformat}
            country=${ifDefined(_schedule.arrival?.country)}
            city=${ifDefined(_schedule.arrival?.city)}
            timezone=${ifDefined(_schedule.arrival?.timezone)}
          >
            ${ifDefined(_schedule.arrival?.description)}
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