import {type Dayjs} from 'dayjs';
import {Dictionary} from '../utils/interfaces';
export declare class VtbParticipant {
  id?: number;
  title?: string;
  name?: string;
  prefix?: string;
  surname?: string;
  birthdate?: Dayjs;
}
export declare class VtbParty {
  id: number | string;
  participants: Array<VtbParticipant>;
}
export declare class VtbMedia {
  src?: string;
  tags: Array<string>;
  id?: string;
}
export declare class VtbExtraField {
  name: string;
  title?: string;
  value?: string;
  type?: string;
  group_name?: string;
  options?: Array<string>;
}
export declare class VtbFlight {
  date?: Dayjs;
  IATA?: string;
  dateformat?: string;
  timezone?: string;
  country?: string;
  city?: string;
  description?: string;
  location?: VtbGeoLocation;
}
export declare class VtbFlightCarrier {
  name?: string;
  code?: string;
}
export declare class VtbFlightData {
  departure?: VtbFlight;
  arrival?: VtbFlight;
  carrier?: VtbFlightCarrier;
  flightnumber?: string;
  day?: number;
}
export declare class VtbParticipantPrice {
  participant_id: string;
  price: number;
}
export declare class VtbElement {
  id: number;
  object_id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price: number;
  price_diff: number;
  optional: boolean;
  nights: number;
  hidden: boolean;
  day?: number;
  unit_id?: number;
  participants: Array<VtbParticipantPrice>;
  grouptitle?: string;
  media: Array<VtbMedia>;
  location?: VtbGeoLocation;
}
export declare class VtbElementGroup {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  nights: number;
  hidden: boolean;
  day?: number;
  type_id?: number;
  elements: Dictionary<Array<VtbElement>>;
  media: Array<VtbMedia>;
  location?: VtbGeoLocation;
}
export declare class VtbGeoLocation {
  lat: number;
  lng: number;
}
export declare class VtbData {
  title: string;
  subtitle: string;
  start_date?: Dayjs;
  end_date?: Dayjs;
  duration: number;
  sales_price: number;
  flight_elements: Array<VtbFlightData>;
  car_rental_elements: Array<VtbElement>;
  participants: Dictionary<VtbParticipant>;
  parties: Dictionary<VtbParty>;
  covers: Array<VtbMedia>;
  extra_fields: Dictionary<VtbExtraField>;
  days: Array<VtbElement>;
  elements: Dictionary<VtbElementGroup>;
}
//# sourceMappingURL=data.d.ts.map
