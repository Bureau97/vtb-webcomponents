import { type Dayjs } from 'dayjs';
import { Dictionary, VtbFilterConfig } from './utils/interfaces';
export type VtbParticipantCalcType = 'Adult' | 'Teenager' | 'Child' | 'Baby';
export declare class VtbParticipant {
    id: number;
    title?: string;
    name?: string;
    prefix?: string;
    surname?: string;
    birthdate?: Dayjs;
    calc_type?: VtbParticipantCalcType;
    get age(): number | null;
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
    get content(): string | null;
    toString(): string;
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
    duration?: string;
    day?: number;
}
export declare class VtbParticipantPrice {
    participant_id: number;
    price: number;
}
export declare class VtbElement {
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
    get participants(): Array<number>;
}
export declare class VtbElementGroup {
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
    private mapped_elements_by_id;
    private elements_order;
    private mapped_elements_by_type;
    private mapped_elements_by_day;
    add_element(element: VtbElement): void;
    get elements(): Array<VtbElement>;
    filter_elements(config: VtbFilterConfig): Array<VtbElement>;
}
export declare class VtbGeoLocation {
    lat: number;
    lng: number;
}
export declare class VtbMapMarker extends VtbGeoLocation {
    label?: string;
    icon?: string;
    zoom?: number;
    title?: string;
    content?: string;
}
export type VtbMapMarkerConnectMode = 'flight' | 'drive';
export declare class VtbMapMarkerGroup {
    connect_markers: boolean;
    markers: Array<VtbMapMarker>;
    connect_mode?: VtbMapMarkerConnectMode;
    get connectMode(): string;
    set connectMode(connect_mode: VtbMapMarkerConnectMode);
    get connectMarkers(): boolean;
    set connectMarkers(connect_markers: boolean);
    get _markers(): Array<VtbMapMarker>;
}
export declare class VtbTravelPlanData {
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