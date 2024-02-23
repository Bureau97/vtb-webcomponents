import { type Dayjs } from 'dayjs';
import * as types from './types.js';
export interface Dictionary<Type> {
    [key: string | number]: Type;
}
export interface VtbFilterConfig {
    group_ids?: Array<number | string | null>;
    group_type_ids?: Array<Array<number | string | null>> | Array<number | string | null>;
    element_ids?: Array<number | string | null>;
    element_unit_ids?: Array<Array<number | string | null>> | Array<number | string | null>;
    participant_ids?: Array<number | string | null> | Array<number | string | null>;
    days?: Array<number | string>;
    optional?: boolean;
    carrental?: boolean;
    flight?: boolean;
}
export interface VtbConfig {
    calculate_flight_duration: boolean;
}
export interface VtbParticipant {
    title?: string;
    name?: string;
    prefix?: string;
    surname?: string;
    birthdate?: Dayjs;
    calc_type?: types.VtbParticipantCalcType;
}
export interface VtbParty {
    id: number | string;
    participants: Array<VtbParticipant>;
}
export interface VtbMedia {
    src?: string;
    tags: Array<string>;
    id?: string;
}
export interface VtbExtraField {
    name: string;
    title?: string;
    value?: string;
    type?: string;
    group_name?: string;
    options?: Array<string>;
}
export interface VtbFlight {
    date?: Dayjs;
    IATA?: string;
    dateformat?: string;
    timezone?: string;
    country?: string;
    city?: string;
    description?: string;
    location?: VtbGeoLocation;
}
export interface VtbFlightCarrier {
    name?: string;
    code?: string;
}
export interface VtbFlightData {
    departure?: VtbFlight;
    arrival?: VtbFlight;
    carrier?: VtbFlightCarrier;
    flightnumber?: string;
    duration?: string;
    day?: number;
    operated_by?: string;
}
export interface VtbParticipantPrice {
    participant_id: number;
    price: number;
}
export interface VtbElementUnit {
    title: string;
    participant_prices: Array<VtbParticipantPrice>;
}
export interface VtbElement {
    id: string;
    object_id?: string;
    title: string;
    subtitle?: string;
    description?: string;
    additional_description?: string;
    price: number;
    price_diff: number;
    optional: boolean;
    nights: number;
    hidden: boolean;
    day: number;
    startdate: Dayjs;
    enddate: Dayjs;
    unit_id: number;
    participant_prices: Array<VtbParticipantPrice>;
    grouptitle?: string;
    media: Array<VtbMedia>;
    location?: VtbMapMarker;
    units: Array<VtbElementUnit>;
}
export interface VtbElementGroup {
    id: string;
    title?: string;
    subtitle?: string;
    description?: string;
    nights: number;
    hidden: boolean;
    day: number;
    startdate: Dayjs;
    enddate: Dayjs;
    type_id?: number;
    unit_id?: number;
    media: Array<VtbMedia>;
    location?: VtbMapMarker;
    is_flight: boolean;
    is_carrental: boolean;
}
export interface VtbGeoLocation {
    lat: number;
    lng: number;
}
export interface VtbMapMarker extends VtbGeoLocation {
    label?: string;
    icon?: string;
    zoom?: number;
    title?: string;
    content?: string;
}
export interface VtbMapMarkerGroup {
    connect_markers: boolean;
    markers: Array<VtbMapMarker>;
    connect_mode?: types.VtbMapMarkerConnectMode;
}
export interface VtbTravelPlanData {
    title: string;
    subtitle: string;
    covers: Array<VtbMedia>;
    extra_fields: Dictionary<VtbExtraField>;
    start_date?: Dayjs;
    end_date?: Dayjs;
    duration: number;
    parties: Dictionary<VtbParty>;
    sales_price: number;
    flight_elements: Array<VtbFlightData>;
    car_rental_elements: Array<VtbElement>;
}
//# sourceMappingURL=interfaces.d.ts.map