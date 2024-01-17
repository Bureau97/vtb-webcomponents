import dayjs, {type Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import {Dictionary, VtbFilterConfig} from './utils/interfaces.js';
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
}

export class VtbElementUnit implements interfaces.VtbElementUnit {
  title: string = '';
  participant_prices: Array<VtbParticipantPrice> = [];
}

export class VtbElement implements interfaces.VtbElement {
  id: string = '';
  object_id?: string;
  ts_product_id?: number;
  title: string = '';
  subtitle?: string;
  description?: string;
  additional_description?: string;
  price = 0.0;
  price_diff = 0.0;
  optional = false;
  nights = 0;
  hidden = false;
  day: number = 0;
  startdate: Dayjs = dayjs();
  enddate: Dayjs = dayjs();
  unit_id: number = 0;
  participant_prices: Array<VtbParticipantPrice> = [];
  grouptitle?: string;
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
  units: Array<VtbElementUnit> = [];

  get participants(): Array<number> {
    return this.participant_prices.map((participant_price) => {
      return participant_price.participant_id;
    });
  }

  get last_day(): number {
    return this.day + this.nights;
  }

  get days(): number {
    return this.nights + 1;
  }

  public clone(): VtbElement {
    const _clone = Object.assign(new VtbElement(), structuredClone(this));

    _clone.startdate = dayjs(this.startdate.format());
    _clone.enddate = dayjs(this.enddate.format());

    _clone.media = [];
    for (const _m of this.media) {
      _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
    }

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

  public add_element(element: VtbElement) {
    this.mapped_elements_by_id[element.id] = element;
    this.elements_order.push(element.id);

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
    const ret: Array<VtbElement> = [];
    for (const id of this.elements_order) {
      ret.push(this.mapped_elements_by_id[id]);
    }
    return ret;
  }

  filter_elements(config: VtbFilterConfig): Array<VtbElement> {
    // const _element_ids = config.element_ids || [];
    // const element_ids = _element_ids.flat(Infinity);

    const _element_unit_ids = config.element_unit_ids || [];
    const element_unit_ids = _element_unit_ids.flat(Infinity);

    const _participant_ids = config?.participant_ids || [];
    const participant_ids = _participant_ids.flat(Infinity);

    let check_element_unit_ids = false;
    if (element_unit_ids.length >= 1) {
      check_element_unit_ids = true;
    }

    let check_participant_ids = false;
    if (participant_ids.length >= 1) {
      check_participant_ids = true;
    }

    let skip_optional = false;
    if (config?.optional === false) {
      skip_optional = true;
    }

    let only_optional = false;
    if (config?.optional === true) {
      only_optional = true;
    }

    if (
      !check_element_unit_ids &&
      !check_participant_ids &&
      !skip_optional &&
      !only_optional
    ) {
      return this.elements;
    }

    let _elm_ids: Array<string> = [];
    if (check_element_unit_ids) {
      for (const unit_id of element_unit_ids) {
        if (!this.mapped_elements_by_type[Number(unit_id)]) {
          continue;
        }

        _elm_ids = _elm_ids.concat(
          this.mapped_elements_by_type[Number(unit_id)]
        );
      }
    } else {
      _elm_ids = this.elements_order;
    }

    const _elements: Array<VtbElement> = [];
    for (const id of this.elements_order) {
      if (!_elm_ids.includes(id)) {
        continue;
      }

      const _element = this.mapped_elements_by_id[id];

      if (skip_optional && _element.optional) {
        continue;
      }

      if (only_optional && !_element.optional) {
        continue;
      }

      if (!check_participant_ids) {
        _elements.push(_element);
        continue;
      }

      if (check_participant_ids && _element.participants) {
        // make a shallow copy so we're not messing with the original price element
        const _element_copy: VtbElement = _element.clone();

        let participants_unit_price = 0.0;
        for (const participant_price of _element.participant_prices) {
          if (participant_ids.includes(participant_price.participant_id)) {
            participants_unit_price += participant_price.price;
          }
        }
        _element_copy.price = participants_unit_price;
        _elements.push(_element_copy);
      }
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
