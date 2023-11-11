import dayjs, {type Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import {Dictionary} from './utils/interfaces';

export class VtbParticipant {
  id?: number;
  title?: string;
  name?: string;
  prefix?: string;
  surname?: string;
  birthdate?: Dayjs;
}

export class VtbParty {
  id: number | string = '';
  participants: Array<VtbParticipant> = [];
}

export class VtbMedia {
  src?: string;
  tags: Array<string> = [];
  id?: string;
}

export class VtbExtraField {
  name: string = '';
  title?: string;
  value?: string;
  type?: string;
  group_name?: string;
  options?: Array<string>;

  get content(): string | null
  {
    return this.value ?? null;
  }

  toString(): string {
    return this.value ?? '';
  }
}

export class VtbFlight {
  date?: Dayjs;
  IATA?: string;
  dateformat?: string = 'DD MMM';
  timezone?: string = 'UTC+01:00';
  country?: string;
  city?: string;
  description?: string;
  location?: VtbGeoLocation;
}

export class VtbFlightCarrier {
  name?: string;
  code?: string;
}

export class VtbFlightData {
  departure?: VtbFlight;
  arrival?: VtbFlight;
  carrier?: VtbFlightCarrier;
  flightnumber?: string;
  duration?: string;
  day?: number;
}

export class VtbParticipantPrice {
  participant_id = '';
  price = 0.0;
}

export class VtbElement {
  id: string = '';
  object_id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price = 0.0;
  price_diff = 0.0;
  optional = false;
  nights = 0;
  hidden = false;
  day?: number;
  startdate?: Dayjs;
  enddate?: Dayjs;
  unit_id?: number;
  participants: Array<VtbParticipantPrice> = [];
  grouptitle?: string;
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
}

export class VtbElementGroup {
  id: string = '';
  title?: string;
  subtitle?: string;
  description?: string;
  nights = 0;
  hidden = false;
  day?: number;
  startdate?: Dayjs;
  enddate?: Dayjs;
  type_id?: number;
  unit_id?: number;
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
  is_flight = false;
  is_carrental = false;

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
    let ret: Array<VtbElement> = [];
    for (const id of this.elements_order) {
      ret.push(this.mapped_elements_by_id[id]);
    }
    return ret;
  }

  get_element_unit_ids(): Array<number> {
    return Object.keys(this.mapped_elements_by_type).map((id) => {
      return Number(id);
    })
  }

  get_elements_by_unit_id(unit_id: number): Array<VtbElement> {
    let ret: Array<VtbElement> = [];
    for (const id of this.mapped_elements_by_type[unit_id]) {
      ret.push(this.mapped_elements_by_id[id]);
    }
    return ret;
  }
}

export class VtbGeoLocation {
  lat = 0.0;
  lng = 0.0;
}

export class VtbMapMarker extends VtbGeoLocation {
  label?: string;
  icon?: string;
  zoom?: number;
  title?: string;
  content?: string;
}

export type VtbMapMarkerConnectMode = 'flight' | 'drive';

export class VtbMapMarkerGroup {
  connect_markers: boolean = false;
  markers: Array<VtbMapMarker> = [];
  connect_mode?: VtbMapMarkerConnectMode = 'flight';

  get connectMode(): string {
    return <string>this.connect_mode;
  }

  set connectMode(connect_mode: VtbMapMarkerConnectMode) {
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

export class VtbTravelPlanData {
  title: string = '';
  subtitle: string = '';
  covers: Array<VtbMedia> = [];
  extra_fields: Dictionary<VtbExtraField> = {};

  start_date?: Dayjs;
  end_date?: Dayjs;
  duration: number = 0; // the number of days
  parties: Dictionary<VtbParty> = {};
  participants: Dictionary<VtbParticipant> = {};

  sales_price: number = 0;

  flight_elements: Array<VtbFlightData> = [];

  public add_flight_element(flight_element: VtbFlightData) {
    this.flight_elements.push(flight_element);
  }

  car_rental_elements: Array<VtbElement> = [];

  public add_carrental_element(carrental_element: VtbElement) {
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
      if (!this.mapped_element_groups_by_type[group.type_id]) {
        this.mapped_element_groups_by_type[group.type_id] = [];
      }
      this.mapped_element_groups_by_type[group.type_id].push(group.id);
    }

    if (group.day) {
      if (!this.mapped_element_groups_by_day[group.day]) {
        this.mapped_element_groups_by_day[group.day] = [];
      }
      this.mapped_element_groups_by_day[group.day].push(group.id);
    }
  }

  get element_groups(): Array<VtbElementGroup> {
    let ret: Array<VtbElementGroup> = [];
    for (const group_id of this.element_groups_order) {
      ret.push(this.mapped_element_groups[group_id]);
    }
    return ret;
  }

  public get_element_group_by_id(id: string): VtbElementGroup {
    return this.mapped_element_groups[id];
  }

  public get_element_groups_by_type_id(group_type_id: number): Array<VtbElementGroup> {
    const _group_ids = this.mapped_element_groups_by_type[group_type_id];
    let ret: Array<VtbElementGroup> = [];
    for (const group_id of _group_ids) {
      ret.push(this.mapped_element_groups[group_id]);
    }
    return ret;
  }

  public get_element_group_type_ids(): Array<number> {
    return Object.keys(this.mapped_element_groups_by_type).map((id) => {
      return Number(id);
    });
  }

  public get_element_groups_by_day(day: number): Array<VtbElementGroup> {
    const _group_ids = this.mapped_element_groups_by_day[day];
    let ret: Array<VtbElementGroup> = [];
    for (const group_id of _group_ids) {
      ret.push(this.mapped_element_groups[group_id]);
    }
    return ret;
  }

  // private mapped_elements: Dictionary<VtbElement> = {};


  // markergroups: Dictionary<Array<VtbMapMarkerGroup>> = [];
}
