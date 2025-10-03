/**
 *
 * Copyright 2024 Huub Segers - B97
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import dayjs, {type Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
import murmurhash from 'murmurhash';

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import {Dictionary, VtbFilterConfig, SizedMap} from './utils/interfaces.js';
import * as interfaces from './utils/interfaces.js';
import * as types from './utils/types.js';

export class VtbParticipant implements interfaces.VtbParticipant {
  id = 0;
  title?: string;
  name?: string;
  prefix?: string = '';
  surname?: string;
  birthdate?: Dayjs;
  calc_type?: types.VtbParticipantCalcType;

  get age(): number | null {
    if (!this.birthdate) {
      return null;
    }

    return dayjs().diff(this.birthdate, 'year');
  }

  get fullname(): string {
    return `${this.name} ${this.prefix ? this.prefix + ' ' : ''}${
      this.surname
    }`;
  }
}

export class VtbParticipantPrice implements interfaces.VtbParticipantPrice {
  participant_id: number = 0;
  price = 0.0;
  price_diff = 0.0;
}

export class VtbParty implements interfaces.VtbParty {
  id: number | string = '';
  participants: Array<VtbParticipant> = [];
}

export class VtbMedia implements interfaces.VtbMedia {
  src?: string;
  tags: Array<string> = [];
  id?: string;
}

export class VtbExtraField implements interfaces.VtbExtraField {
  name: string = '';
  title?: string;
  value?: string;
  type?: string;
  group_name?: string;
  options?: Array<string>;

  get content(): string | null {
    return this.value ?? null;
  }

  toString(): string {
    return this.value ?? '';
  }
}

export class VtbFlight implements interfaces.VtbFlight {
  date?: Dayjs;
  IATA?: string;
  dateformat?: string = 'DD MMM';
  timezone?: string = 'UTC+01:00';
  country?: string;
  city?: string;
  description?: string;
  location?: VtbGeoLocation;
}

export class VtbFlightCarrier implements interfaces.VtbFlightCarrier {
  name?: string;
  code?: string;
}

export class VtbFlightData implements interfaces.VtbFlightData {
  departure?: VtbFlight;
  arrival?: VtbFlight;
  carrier?: VtbFlightCarrier;
  flightnumber?: string;
  duration?: string;
  day?: number;
  operated_by?: string;
  nights: number = 0;
}

export class VtbElementUnit implements interfaces.VtbElementUnit {
  // id: string = '';  // produced by murmurhash
  title: string = '';
  participant_prices: SizedMap<number, VtbParticipantPrice> = new Map(
    null
  ) as SizedMap<number, VtbParticipantPrice>;
  quantity: number = 1;
  optional: boolean = false;
  // price: number = 0.0;
  // price_diff: number = 0.0;
  description: string = '';
  additional_description: string = '';
  media: Array<VtbMedia> = [];
  extra_fields: Dictionary<VtbExtraField> = {};
  location?: VtbMapMarker;
  _element_id: number = 0;
  _ts_product_id: number = 0;

  constructor() {
    this._setup_participant_prices();
  }

  private _setup_participant_prices() {
    this.participant_prices = new Map(null) as SizedMap<
      number,
      VtbParticipantPrice
    >;

    // add length property for backwards compatibility
    Object.defineProperty(this.participant_prices, 'length', {
      get: () => this.participant_prices.size
    });
  }

  private _hash: number = 0;

  get id(): string {
    if (!this._hash || this._hash == 0) {
      const to_hash = [
        this.title,
        this.optional.toString(),
        new String(this.participant_prices.size)
      ].join(':');
      this._hash = murmurhash.v3(to_hash, 0x9747b28c);
    }

    return this._hash.toString(16); // cast to string
  }

  get participants(): Array<number> {
    return [...this.participant_prices.keys()];
  }

  get price(): number {
    let _price = Number(0.0);
    for (const _p of this.participant_prices.values()) {
      _price += _p.price;
    }
    return _price;
  }

  get price_diff(): number {
    let _price_diff = Number(0.0);
    for (const _p of this.participant_prices.values()) {
      _price_diff += _p.price_diff;
    }

    return _price_diff;
  }

  public clone(deep: boolean = false): VtbElementUnit {
    const _clone = Object.assign(new VtbElementUnit(), structuredClone(this));

    _clone.media = [];
    for (const _m of this.media) {
      _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
    }

    // reset participant_prices
    _clone.participant_prices = new Map(null) as SizedMap<
      number,
      VtbParticipantPrice
    >;
    Object.defineProperty(_clone.participant_prices, 'length', {
      get: () => this.participant_prices.size
    });

    if (deep) {
      for (const [key, value] of this.participant_prices) {
        _clone.participant_prices.set(
          key,
          Object.assign(new VtbParticipantPrice(), structuredClone(value))
        );
      }
    }

    return _clone;
  }
}

export class VtbElement implements interfaces.VtbElement {
  id: string = '';
  object_id?: string;
  ts_product_id: number = 0;
  title: string = '';
  subtitle: string = '';
  // description: string = '';
  // additional_description: string = '';
  // price = 0.0;
  // price_diff = 0.0;
  // optional = false;
  nights = 0;
  hidden = false;
  day: number = 0;
  startdate: Dayjs = dayjs();
  enddate: Dayjs = dayjs();
  unit_id: number = 0;
  participant_prices: Array<VtbParticipantPrice> = [];
  grouptitle?: string;
  // media: Array<VtbMedia> = [];
  // location?: VtbMapMarker;
  _units: Array<VtbElementUnit> = [];
  // extra_fields: Dictionary<VtbExtraField> = {};

  get optional(): boolean {
    return this._units.length > 0 ? this._units[0].optional : false;
  }

  get price(): number {
    let _price = Number(0.0);

    for (const _u of this._units) {
      if (_u.optional && _u.price_diff != 0) {
        continue;
      }

      _price += _u.price;
    }

    return _price;

    // return this._units.length > 0 ? this._units[0].price : 0.0;
  }

  get price_diff(): number {
    let _price_diff = Number(0.0);

    for (const _u of this._units) {
      if (!_u.optional) {
        continue;
      }

      _price_diff += _u.price_diff != 0 ? _u.price_diff : _u.price;
    }

    return _price_diff;

    // return this._units.length > 0 ? this._units[0].price_diff : 0.0;
  }

  private _grouped: Array<VtbElementUnit> = [];
  get units(): Array<VtbElementUnit> {
    if (this._grouped.length <= 0 && this._units.length > 1) {
      const grouped: Dictionary<VtbElementUnit> = {};

      for (const _u of this._units) {
        const _existing_keys = Object.keys(grouped);
        if (!_existing_keys.includes(_u.id)) {
          grouped[_u.id] = _u.clone(true);
          // grouped[_u.id].participant_prices = _u.participant_prices;
        } else {
          // grouped[_u.id].participant_prices.push(..._u.participant_prices);  // TODO: merge participant_prices??
          grouped[_u.id].quantity++;
          _u.participant_prices.forEach(
            (value: VtbParticipantPrice, key: number) => {
              grouped[_u.id].participant_prices.set(key, value);
            }
          );
        }
      }

      // sort non-optional first
      const _list = Object.values(grouped);
      _list.sort((a: VtbElementUnit, b: VtbElementUnit) => {
        const optionalDiff = Number(a.optional) - Number(b.optional);

        if (optionalDiff != 0) {
          return optionalDiff;
        }

        return a.price - b.price;
      });

      this._grouped = _list;
    }

    // console.info('[vtbElement.units] return:');
    // console.log('[vtbElement.units] units: ', this._units);
    // console.log('[vtbElement.units] grouped: ', this._grouped);

    return this._grouped.length ? this._grouped : this._units;
  }

  get participants(): Array<number> {
    const _participants = [];
    for (const _u of this._units) {
      _participants.push(..._u.participants);
    }
    return _participants;
    // return this.participant_prices.map((participant_price) => {
    //   return participant_price.participant_id;
    // });
  }

  get last_day(): number {
    return this.day + this.nights;
  }

  get days(): number {
    return this.nights + 1;
  }

  get description(): string {
    return this._units.length > 0 ? this._units[0].description : '';
  }

  get additional_description(): string {
    return this._units.length > 0 ? this._units[0].additional_description : '';
  }

  get extra_fields(): Dictionary<VtbExtraField> {
    return this._units.length > 0 ? this._units[0].extra_fields : {};
  }

  get media(): Array<VtbMedia> {
    // const _media = [];
    // for (const _u of this._units) {
    //   _media.push(..._u.media);
    // }
    // return _media;
    return this._units.length > 0 ? this._units[0].media : [];
  }

  get location(): VtbMapMarker | undefined {
    return this._units.length > 0 ? this._units[0].location : undefined;
  }

  get locations(): Array<VtbMapMarker> {
    const _locations = [];

    for (const _u of this._units) {
      if (!_u.location) continue;
      _locations.push(_u.location);
    }

    return _locations;
  }

  public clone(): VtbElement {
    const _clone = Object.assign(new VtbElement(), structuredClone(this));

    _clone.startdate = dayjs(this.startdate.format());
    _clone.enddate = dayjs(this.enddate.format());

    // _clone.media = [];
    // for (const _m of this.media) {
    //   _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
    // }

    // reset units and grouped
    _clone._units = [];
    _clone._grouped = [];

    // for (const _u of this._units) {
    //   _clone._units.push(
    //     Object.assign(new VtbElementUnit(), structuredClone(_u))
    //   );
    // }

    return _clone;
  }
}

export class VtbElementGroup implements interfaces.VtbElementGroup {
  id: string = '';
  title?: string;
  subtitle?: string;
  description?: string;
  nights = 0;
  hidden = false;
  day = 0;
  startdate: Dayjs = dayjs();
  enddate: Dayjs = dayjs();
  type_id?: number;
  unit_id?: number;
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
  is_flight = false;
  is_carrental = false;

  get last_day(): number {
    return this.day + this.nights;
  }

  get days(): number {
    return this.nights + 1;
  }

  private mapped_elements_by_id: Dictionary<VtbElement> = {};
  private elements_order: Array<string> = [];
  private mapped_elements_by_type: Dictionary<Array<string>> = {};
  private mapped_elements_by_day: Dictionary<Array<string>> = {};
  private _elements: Array<VtbElement> = [];

  public add_element(element: VtbElement) {
    this.mapped_elements_by_id[element.id] = element;
    this.elements_order.push(element.id);

    this._elements.push(element);

    if (element.unit_id) {
      if (!this.mapped_elements_by_type[element.unit_id]) {
        this.mapped_elements_by_type[element.unit_id] = [];
      }
      this.mapped_elements_by_type[element.unit_id].push(element.id);
    }

    if (element.day) {
      if (!this.mapped_elements_by_day[element.day]) {
        this.mapped_elements_by_day[element.day] = [];
      }
      this.mapped_elements_by_day[element.day].push(element.id);
    }
  }

  get elements(): Array<VtbElement> {
    // const ret: Array<VtbElement> = [];
    // for (const id of this.elements_order) {
    //   ret.push(this.mapped_elements_by_id[id]);
    // }
    // return ret;
    return this._elements;
  }

  set elements(elements: Array<VtbElement>) {
    this._elements = elements;
  }

  filter_elements(config: VtbFilterConfig): Array<VtbElement> {
    // const _element_ids = config.element_ids || [];
    // const element_ids = _element_ids.flat(Infinity);
    // console.info('filter_elements: ', config);

    const _element_unit_ids = config.element_unit_ids || [];
    const element_unit_ids = _element_unit_ids.flat(Infinity);

    const _participant_ids = config?.participant_ids || [];
    const participant_ids = _participant_ids.flat(Infinity);

    let check_element_unit_ids = false;
    if (element_unit_ids.length >= 1) {
      // console.info('check_element_unit_ids: ', element_unit_ids);
      check_element_unit_ids = true;
    }

    let check_participant_ids = false;
    if (participant_ids.length >= 1) {
      // console.info('check_participant_ids: ', participant_ids);
      check_participant_ids = true;
    }

    let skip_optional = false;
    if (config?.optional === false) {
      // console.info('skip_optional');
      skip_optional = true;
    }

    let only_optional = false;
    if (config?.optional === true) {
      // console.info('only_optional');
      only_optional = true;
    }

    if (
      !check_element_unit_ids &&
      !check_participant_ids &&
      !skip_optional &&
      !only_optional
    ) {
      // console.info('no filters, return all elements');
      return this._elements;
    }

    const _elements: Array<VtbElement> = [];

    for (const _element of this._elements) {
      if (
        check_element_unit_ids &&
        !element_unit_ids.includes(Number(_element.unit_id))
      ) {
        continue;
      }

      // console.info('[filter elements] working on element: ', _element.title);

      // if (!_elm_ids.includes(id)) {
      //   continue;
      // }

      // const _element = this.mapped_elements_by_id[id];
      const _element_copy = _element.clone();

      // console.info('[filter elements] element: ', _element.title);
      for (const unit of _element._units) {
        // console.info('[filter elements] unit: ', unit.title, unit.optional);

        if (skip_optional && unit.optional) {
          // console.info('[filter elements] skip optional');
          continue;
        }

        if (only_optional && !unit.optional) {
          // console.info('[filter elements] only optional');
          continue;
        }

        const unit_copy = unit.clone();

        if (!check_participant_ids) {
          // console.info(
          //   '[filter elements] no participant ids requested, add participant prices to clone..'
          // );
          unit_copy.participant_prices = unit.participant_prices;

          // console.info(
          //   '[filter elements] participant prices: ',
          //   unit_copy.participant_prices,
          //   typeof unit_copy.participant_prices
          // );

          _element_copy._units.push(unit_copy);
          continue;
        }

        if (check_participant_ids && _element.participants.length > 0) {
          // console.info('[filter elements] check participant ids', unit.participant_prices, participant_ids);

          // let unit_participants_price = 0;
          participant_ids.forEach((participant_id) => {
            if (unit.participant_prices.has(Number(participant_id))) {
              const unit_participant_price = unit.participant_prices.get(
                Number(participant_id)
              );

              if (!unit_participant_price) {
                console.info(
                  '[filter elements] no unit_participant_price found for participant_id: ',
                  participant_id
                );
                return;
              }

              unit_copy.participant_prices.set(
                Number(participant_id),
                unit_participant_price
              );
            }
          });

          // for (const participant_price of unit.participant_prices) {
          //   // console.info('[filter elements] participant_price: ', participant_price);
          //   if (
          //     participant_ids.includes(Number(participant_price.participant_id))
          //   ) {
          //     // unit_copy.participant_prices.push(participant_price);
          //     unit_participants_price += participant_price.price;
          //   }
          // }

          // unit_copy.price = unit_participants_price;

          if (unit_copy.participant_prices.size === 0) {
            // if no participant prices left, skip unit because this unit
            // does not contain the requested participants
            continue;
          }

          // we can now add the unit to the element
          _element_copy._units.push(unit_copy);
        }
      }

      if (_element_copy._units.length === 0) {
        // console.info('[filter elements] no units left, skip element');
        continue;
      }

      // console.info('[filter elements] add element_copy: ', _element_copy);
      _elements.push(_element_copy);
    }

    return _elements;
  }

  public clone(): VtbElementGroup {
    const _clone = Object.assign(new VtbElementGroup(), structuredClone(this));

    _clone.startdate = dayjs(this.startdate.format());
    _clone.enddate = dayjs(this.enddate.format());

    _clone.media = [];
    for (const _m of this.media) {
      _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
    }

    for (const key of Object.keys(this.mapped_elements_by_id)) {
      _clone.mapped_elements_by_id[key] =
        this.mapped_elements_by_id[key].clone();
    }

    return _clone;
  }
}

export class VtbGeoLocation implements interfaces.VtbGeoLocation {
  lat = 0.0;
  lng = 0.0;
}

export class VtbMapMarker
  extends VtbGeoLocation
  implements interfaces.VtbMapMarker
{
  label?: string;
  icon?: string;
  zoom?: number;
  title?: string;
  content?: string;
  default_label: boolean = false;
}

export class VtbMapMarkerGroup implements interfaces.VtbMapMarkerGroup {
  connect_markers: boolean = false;
  markers: Array<VtbMapMarker> = [];
  connect_mode?: types.VtbMapMarkerConnectMode = 'flight';

  get connectMode(): string {
    return <string>this.connect_mode;
  }

  set connectMode(connect_mode: types.VtbMapMarkerConnectMode) {
    this.connect_mode = connect_mode;
  }

  get connectMarkers(): boolean {
    return this.connect_markers;
  }

  set connectMarkers(connect_markers: boolean) {
    this.connect_markers = connect_markers;
  }

  get _markers(): Array<VtbMapMarker> {
    return this.markers;
  }
}

export class VtbTravelPlanData implements interfaces.VtbTravelPlanData {
  title: string = '';
  subtitle: string = '';
  covers: Array<VtbMedia> = [];
  extra_fields: Dictionary<VtbExtraField> = {};

  get extraFields(): Dictionary<VtbExtraField> {
    return this.extra_fields;
  }

  start_date?: Dayjs;
  end_date?: Dayjs;
  duration: number = 0; // the number of days
  parties: Dictionary<VtbParty> = {};

  private mapped_participants: Dictionary<VtbParticipant> = {};
  private participants_order: Array<number> = [];

  public add_participant(participant: VtbParticipant) {
    this.mapped_participants[participant.id] = participant;
    this.participants_order.push(participant.id);
  }

  get participants(): Array<VtbParticipant> {
    const ret: Array<VtbParticipant> = [];
    for (const id of this.participants_order) {
      ret.push(this.mapped_participants[id]);
    }
    return ret;
  }

  sales_price: number = 0;

  flight_elements: Array<VtbFlightData> = [];

  public add_flight_element(flight_element: VtbFlightData) {
    this.flight_elements.push(flight_element);
  }

  car_rental_elements: Array<VtbElement> = [];

  public add_carrental_element(carrental_element: VtbElement) {
    // console.info('carrental: ', carrental_element);
    this.car_rental_elements.push(carrental_element);
  }

  // days: Array<VtbElement> = [];

  private mapped_element_groups: Dictionary<VtbElementGroup> = {};
  private element_groups_order: Array<string> = [];
  private mapped_element_groups_by_type: Dictionary<Array<string>> = {};
  private mapped_element_groups_by_day: Dictionary<Array<string>> = {};

  public add_element_group(group: VtbElementGroup) {
    this.mapped_element_groups[group.id] = group;
    this.element_groups_order.push(group.id);

    if (group.type_id) {
      const group_type_id = Number(group.type_id);
      if (!this.mapped_element_groups_by_type[group_type_id]) {
        this.mapped_element_groups_by_type[group_type_id] = [];
      }
      this.mapped_element_groups_by_type[group_type_id].push(group.id);
    }

    if (group.day) {
      if (!this.mapped_element_groups_by_day[group.day]) {
        this.mapped_element_groups_by_day[group.day] = [];
      }
      this.mapped_element_groups_by_day[group.day].push(group.id);
    }
  }

  get element_groups(): Array<VtbElementGroup> {
    const ret: Array<VtbElementGroup> = [];
    for (const group_id of this.element_groups_order) {
      ret.push(this.mapped_element_groups[group_id]);
    }
    return ret;
  }

  public filter_element_groups(
    config: VtbFilterConfig
  ): Array<VtbElementGroup> {
    const ret: Array<VtbElementGroup> = [];

    const _group_type_ids = config?.group_type_ids || [];

    // if no group_type_ids are set, then we get and return all groups
    if (_group_type_ids.length == 0) {
      return this.element_groups;
    }

    let _group_ids: Array<string> = [];
    for (const group_type_id of _group_type_ids) {
      _group_ids = _group_ids.concat(
        this.mapped_element_groups_by_type[Number(group_type_id)]
      );
    }

    for (const group_id of this.element_groups_order) {
      if (_group_ids.includes(group_id)) {
        ret.push(this.mapped_element_groups[group_id]);
      }
    }

    return ret;
  }

  public filter_elements(config: VtbFilterConfig): Array<VtbElement> {
    let ret: Array<VtbElement> = [];

    const element_groups = this.filter_element_groups(config);
    for (const group of element_groups) {
      // console.info('group: ', group.title);
      ret = ret.concat(group.filter_elements(config));
    }

    return ret;
  }

  public get_element_groups_by_day(day: number): Array<VtbElementGroup> {
    // TODO: refactor
    const _group_ids = this.mapped_element_groups_by_day[day];
    const ret: Array<VtbElementGroup> = [];
    for (const group_id of _group_ids) {
      ret.push(this.mapped_element_groups[group_id]);
    }
    return ret;
  }

  // private mapped_elements: Dictionary<VtbElement> = {};

  // markergroups: Dictionary<Array<VtbMapMarkerGroup>> = [];
}
