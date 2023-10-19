import dayjs, {type Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import {Dictionary} from '../utils/interfaces';

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
  id = 0;
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
  unit_id?: number;
  participants: Array<VtbParticipantPrice> = [];
  grouptitle?: string;
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
}

export class VtbElementGroup {
  id = 0;
  title?: string;
  subtitle?: string;
  description?: string;
  nights = 0;
  hidden = false;
  day?: number;
  type_id?: number;
  elements: Dictionary<Array<VtbElement>> = {};
  media: Array<VtbMedia> = [];
  location?: VtbMapMarker;
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
  content ?: string;
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

export class VtbData {
  title: string = '';
  subtitle: string = '';

  start_date?: Dayjs;
  end_date?: Dayjs;
  duration: number = 0; // the number of days
  sales_price: number = 0;

  flight_elements: Array<VtbFlightData> = [];
  car_rental_elements: Array<VtbElement> = [];
  participants: Dictionary<VtbParticipant> = {};
  parties: Dictionary<VtbParty> = {};

  covers: Array<VtbMedia> = [];
  extra_fields: Dictionary<VtbExtraField> = {};
  days: Array<VtbElement> = [];

  element_groups: Dictionary<Array<VtbElementGroup>> = {};

  // markergroups: Dictionary<Array<VtbMapMarkerGroup>> = [];
}
