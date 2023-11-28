import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {TemplateResult} from 'lit-element';

import dayjs, {type Dayjs} from 'dayjs';
import 'dayjs/esm/locale/nl/index.js';
dayjs.locale('nl');

import * as _ from 'lodash';
const {isEqual} = _;

import {VtbFlightData} from '../models.js';

export interface VtbFlightScheduleOptions {
  dateformat?: string;
}

class VtbBaseFlightElement extends LitElement {
  @property({type: String})
  IATA?: string;

  @property({type: String})
  date?: string;

  @property({type: String})
  time?: string;

  @property({type: String})
  timezone = '02:00';

  @property({type: String})
  dateformat = 'DD MMM (hh:mm)';

  @property({type: String})
  country?: string;

  @property({type: String})
  city?: string;

  type = 'departure';

  static override styles = css`
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

  override render() {
    const date = dayjs(this.date);

    if (!this.dateformat || this.dateformat == '') {
      return html`
        <div class="row ${this.type}">
          <div class="date-time"></div>
          <div class="description"><slot></slot></div>
        </div>
      `;
    } else {
      return html`
        <div class="row ${this.type}">
          <div class="date-time">${date.format(this.dateformat)}</div>
          <div class="description"><slot></slot></div>
        </div>
      `;
    }
  }
}

@customElement('vtb-flight-departure')
export class VtbFlightDepartureElement extends VtbBaseFlightElement {
  override type = 'departure';
}

@customElement('vtb-flight-arrival')
export class VtbFlightArrivalElement extends VtbBaseFlightElement {
  override type = 'arrival';
}

@customElement('vtb-flight-element')
export class VtbFlightElement extends LitElement {
  @property({type: String})
  flightnumber?: string;

  @property({type: String})
  carrier?: string;

  @property({type: String})
  carrier_code?: string;

  @property({type: String})
  duration?: string;

  static override styles = css`
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

  override render() {
    return html`
      <div class="flight">
        <slot></slot>
        ${this.render_carrier()} ${this.render_duration()}
        ${this.render_flightnumber()}
      </div>
    `;
  }

  render_carrier() {
    if (this.carrier) {
      return html`<div class="carrier">${this.carrier}</div>`;
    }
    return '';
  }

  render_duration() {
    if (this.duration) {
      return html`<div class="duration">${this.duration}</div>`;
    }
    return '';
  }

  render_flightnumber() {
    if (this.flightnumber) {
      return html`<div class="flightnumber">
        ${this.carrier_code}${this.flightnumber}
      </div>`;
    }
    return '';
  }
}

@customElement('vtb-flightschedule')
export class VtbFlightScheduleElement extends LitElement {
  @property({
    type: Array,
    attribute: false,
    hasChanged(newVal: Array<VtbFlightData>, oldVal: Array<VtbFlightData>) {
      return !isEqual(newVal, oldVal);
    },
  })
  flightinfo: Array<VtbFlightData> = [];

  @property({type: String})
  dateformat = 'DD MMM (hh:mm)';

  constructor() {
    super();
    this.flightinfo = [];
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override render() {
    let _innerHTML: string | TemplateResult = '';
    if (this.children.length == 0 && this.flightinfo) {
      _innerHTML = this._renderFlightInfo();
    }
    return html`
      <div class="flight-schedule">
        <slot>${_innerHTML}</slot>
      </div>
    `;
  }

  private _renderFlightInfo() {
    const flightinfo = this.flightinfo as Array<VtbFlightData>;

    const scheduleTemplates = [];
    for (const _schedule of flightinfo) {
      let departure_date: Dayjs | undefined | null = null;
      let arrival_date: Dayjs | undefined | null = null;

      if (
        _schedule.departure?.date &&
        typeof _schedule.departure?.date == 'string'
      ) {
        departure_date = dayjs(_schedule.departure?.date);
      } else {
        departure_date = _schedule.departure?.date;
      }

      if (
        _schedule.arrival?.date &&
        typeof _schedule.arrival?.date == 'string'
      ) {
        arrival_date = dayjs(_schedule.arrival?.date);
      } else {
        arrival_date = _schedule.arrival?.date;
      }

      scheduleTemplates.push(html`
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
    return html`${scheduleTemplates}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-flightschedule': VtbFlightScheduleElement;
    'vtb-flight-element': VtbFlightElement;
    'vtb-flight-departure': VtbFlightDepartureElement;
    'vtb-flight-arrival': VtbFlightArrivalElement;
  }
}
