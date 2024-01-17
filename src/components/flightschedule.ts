import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import {ifDefined} from 'lit/directives/if-defined.js';
import {TemplateResult} from 'lit-element';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import dayjs, {type Dayjs} from 'dayjs';
import 'dayjs/locale/nl.js';
dayjs.locale('nl');

import * as _ from 'lodash';
const {isEqual} = _;

import {VtbFlightData} from '../models.js';

export interface VtbFlightScheduleOptions {
  dateformat?: string;
}

@customElement('vtb-flightschedule')
export class VtbFlightScheduleElement extends LitElement {
  static override styles = css`
    :host {
      width: 100%;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      margin-top: 0;
      margin-right: 1.5rem;
      margin-left: 1.5rem;
    }

    .row > * {
      flex-shrink: 0;
      width: 100%;
      max-width: 100%;
      padding-right: 1.5rem;
      padding-left: 1.5rem;
      margin-top: 0;
    }

    .col {
      flex: 1 0 0%;
    }

    .d-none {
      display: none;
    }

    .flights--flight,
    .flights--header {
      padding: 1.5rem 1rem;
    }

    div.flights--flight > div {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
    }

    div.flights--flight .flightdata--key {
      font-weight: bold;
    }

    div.flights--flight .flightdata--value {
      flex-grow: 2;
    }

    div.flights--flight > div > span {
      display: block;
      flex: 1;
    }

    .flights--flight:nth-child(even) {
      background-color: var(--vtb-flightschedule--background, #0000001a);
    }

    .operatedby {
      font-size: 90%;
    }

    @media (min-width: 992px) {
      .col-lg {
        flex: 1 0 0%;
      }

      div.flights--flight > div > span.flightdata--key {
        display: none;
      }

      .d-lg-flex {
        display: flex;
      }
    }
  `;

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

  render_airport(airport: string | undefined, IATA: string | undefined) {
    if (airport && IATA) {
      return html`<strong>${airport}</strong> (${IATA})`;
    }
    if (airport && !IATA) {
      return html`<strong>${airport}</strong>`;
    }

    return '';
  }

  render_carrier(carrier: string | undefined) {
    if (carrier) {
      return html`${carrier}`;
    }
    return '';
  }

  render_duration(duration: string | undefined) {
    if (duration) {
      return html`${duration}`;
    }
    return '';
  }

  render_flightnumber(
    flightnumber: string | undefined,
    carrier_code: string | undefined
  ) {
    if (flightnumber) {
      return html`${carrier_code}${flightnumber}`;
    }
    return '';
  }

  render_operatedby(operated_by: string | undefined) {
    if (operated_by) {
      return html`<span class="operatedby"
        >Uitgevoerd door ${operated_by}</span
      >`;
    }
    return '';
  }

  private _renderFlightInfo() {
    const flightinfo = this.flightinfo as Array<VtbFlightData>;

    const scheduleTemplates = [];
    for (const flight of flightinfo) {
      let departure_date: Dayjs | undefined | null = null;
      let arrival_date: Dayjs | undefined | null = null;

      if (flight.departure?.date && typeof flight.departure?.date == 'string') {
        departure_date = dayjs(flight.departure?.date);
      } else {
        departure_date = flight.departure?.date;
      }

      if (flight.arrival?.date && typeof flight.arrival?.date == 'string') {
        arrival_date = dayjs(flight.arrival?.date);
      } else {
        arrival_date = flight.arrival?.date;
      }

      scheduleTemplates.push(html`
        <div class="flights--flight row">
          <div class="departure col-lg">
            <span class="flightdata--key d-lg-none">Van</span>
            <span class="flightdata--value">
              ${this.render_airport(
                flight.departure?.description,
                flight.departure?.IATA
              )}
            </span>
          </div>
          <div class="arrival col-lg">
            <span class="flightdata--key d-lg-none">Naar</span>
            <span class="flightdata--value">
              ${this.render_airport(
                flight.arrival?.description,
                flight.arrival?.IATA
              )}
            </span>
          </div>
          <div class="departure--datetime col-lg">
            <span class="flightdata--key d-lg-none">Vertrek</span>
            <span class="flightdata--value"
              >${unsafeHTML(departure_date?.format(this.dateformat))}</span
            >
          </div>
          <div class="arrival--datetime col-lg">
            <span class="flightdata--key d-lg-none">Aankomst</span>
            <span class="flightdata--value"
              >${unsafeHTML(arrival_date?.format(this.dateformat))}</span
            >
          </div>
          <div class="carrier col-lg">
            <span class="flightdata--key d-lg-none"
              >Vluchtnr.<!-- + duur --></span
            >
            <span class="flightdata--value">
              ${this.render_carrier(flight.carrier?.name)}
              (${this.render_flightnumber(
                flight.flightnumber,
                flight.carrier?.code
              )})
              ${this.render_operatedby(flight.operated_by)}
            </span>
          </div>
        </div>
      `);
    }

    return html`
      <div class="flights--header d-none d-lg-flex row">
        <div class="departure col">Van</div>
        <div class="arrival col">Naar</div>
        <div class="departure--datetime col">Vertrek</div>
        <div class="arrival--datetime col">Aankomst</div>
        <div class="carrier col">Vluchtnr.</div>
      </div>
      ${scheduleTemplates}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-flightschedule': VtbFlightScheduleElement;
  }
}
