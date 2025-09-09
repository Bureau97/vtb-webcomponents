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
import { Dictionary, VtbFilterConfig } from './utils/interfaces.js';
import * as interfaces from './utils/interfaces.js';
import * as types from './utils/types.js';
export declare class VtbParticipant implements interfaces.VtbParticipant {
    id: number;
    title?: string;
    name?: string;
    prefix?: string;
    surname?: string;
    birthdate?: Dayjs;
    calc_type?: types.VtbParticipantCalcType;
    get age(): number | null;
    get fullname(): string;
}
export declare class VtbParticipantPrice implements interfaces.VtbParticipantPrice {
    participant_id: number;
    price: number;
}
export declare class VtbParty implements interfaces.VtbParty {
    id: number | string;
    participants: Array<VtbParticipant>;
}
export declare class VtbMedia implements interfaces.VtbMedia {
    src?: string;
    tags: Array<string>;
    id?: string;
}
export declare class VtbExtraField implements interfaces.VtbExtraField {
    name: string;
    title?: string;
    value?: string;
    type?: string;
    group_name?: string;
    options?: Array<string>;
    get content(): string | null;
    toString(): string;
}
export declare class VtbFlight implements interfaces.VtbFlight {
    date?: Dayjs;
    IATA?: string;
    dateformat?: string;
    timezone?: string;
    country?: string;
    city?: string;
    description?: string;
    location?: VtbGeoLocation;
}
export declare class VtbFlightCarrier implements interfaces.VtbFlightCarrier {
    name?: string;
    code?: string;
}
export declare class VtbFlightData implements interfaces.VtbFlightData {
    departure?: VtbFlight;
    arrival?: VtbFlight;
    carrier?: VtbFlightCarrier;
    flightnumber?: string;
    duration?: string;
    day?: number;
    operated_by?: string;
    nights: number;
}
export declare class VtbElementUnit implements interfaces.VtbElementUnit {
    title: string;
    participant_prices: Array<VtbParticipantPrice>;
    quantity: number;
    optional: boolean;
    price: number;
    price_diff: number;
    description: string;
    additional_description: string;
    media: Array<VtbMedia>;
    extra_fields: Dictionary<VtbExtraField>;
    location?: VtbMapMarker;
    private _hash;
    get id(): string;
    get participants(): Array<number>;
    clone(): VtbElementUnit;
}
export declare class VtbElement implements interfaces.VtbElement {
    id: string;
    object_id?: string;
    ts_product_id: number;
    title: string;
    subtitle: string;
    nights: number;
    hidden: boolean;
    day: number;
    startdate: Dayjs;
    enddate: Dayjs;
    unit_id: number;
    participant_prices: Array<VtbParticipantPrice>;
    grouptitle?: string;
    location?: VtbMapMarker;
    _units: Array<VtbElementUnit>;
    get optional(): boolean;
    get price(): number;
    get price_diff(): number;
    private _grouped;
    get units(): Array<VtbElementUnit>;
    get participants(): Array<number>;
    get last_day(): number;
    get days(): number;
    get description(): string;
    get additional_description(): string;
    get extra_fields(): Dictionary<VtbExtraField>;
    get media(): Array<VtbMedia>;
    clone(): VtbElement;
}
export declare class VtbElementGroup implements interfaces.VtbElementGroup {
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
    get last_day(): number;
    get days(): number;
    private mapped_elements_by_id;
    private elements_order;
    private mapped_elements_by_type;
    private mapped_elements_by_day;
    private _elements;
    add_element(element: VtbElement): void;
    get elements(): Array<VtbElement>;
    filter_elements(config: VtbFilterConfig): Array<VtbElement>;
    clone(): VtbElementGroup;
}
export declare class VtbGeoLocation implements interfaces.VtbGeoLocation {
    lat: number;
    lng: number;
}
export declare class VtbMapMarker extends VtbGeoLocation implements interfaces.VtbMapMarker {
    label?: string;
    icon?: string;
    zoom?: number;
    title?: string;
    content?: string;
}
export declare class VtbMapMarkerGroup implements interfaces.VtbMapMarkerGroup {
    connect_markers: boolean;
    markers: Array<VtbMapMarker>;
    connect_mode?: types.VtbMapMarkerConnectMode;
    get connectMode(): string;
    set connectMode(connect_mode: types.VtbMapMarkerConnectMode);
    get connectMarkers(): boolean;
    set connectMarkers(connect_markers: boolean);
    get _markers(): Array<VtbMapMarker>;
}
export declare class VtbTravelPlanData implements interfaces.VtbTravelPlanData {
    title: string;
    subtitle: string;
    covers: Array<VtbMedia>;
    extra_fields: Dictionary<VtbExtraField>;
    get extraFields(): Dictionary<VtbExtraField>;
    start_date?: Dayjs;
    end_date?: Dayjs;
    duration: number;
    parties: Dictionary<VtbParty>;
    private mapped_participants;
    private participants_order;
    add_participant(participant: VtbParticipant): void;
    get participants(): Array<VtbParticipant>;
    sales_price: number;
    flight_elements: Array<VtbFlightData>;
    add_flight_element(flight_element: VtbFlightData): void;
    car_rental_elements: Array<VtbElement>;
    add_carrental_element(carrental_element: VtbElement): void;
    private mapped_element_groups;
    private element_groups_order;
    private mapped_element_groups_by_type;
    private mapped_element_groups_by_day;
    add_element_group(group: VtbElementGroup): void;
    get element_groups(): Array<VtbElementGroup>;
    filter_element_groups(config: VtbFilterConfig): Array<VtbElementGroup>;
    filter_elements(config: VtbFilterConfig): Array<VtbElement>;
    get_element_groups_by_day(day: number): Array<VtbElementGroup>;
}
//# sourceMappingURL=models.d.ts.map