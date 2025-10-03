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
import { type Dayjs } from 'dayjs';
import * as types from './types.js';
export interface Dictionary<Type> {
    [key: string | number]: Type;
}
export interface SizedMap<K, V> extends Map<K, V> {
    length: number;
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
    nights: number;
}
export interface VtbParticipantPrice {
    participant_id: number;
    price: number;
    price_diff: number;
}
export interface VtbElementUnit {
    title: string;
    optional?: boolean;
    participant_prices: Map<number, VtbParticipantPrice>;
    price: number;
    price_diff: number;
    description?: string;
    additional_description?: string;
    media?: Array<VtbMedia>;
    extra_fields?: Dictionary<VtbExtraField>;
    location?: VtbMapMarker;
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
    extra_fields: Dictionary<VtbExtraField>;
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