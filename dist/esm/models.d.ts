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
}
export declare class VtbElementUnit implements interfaces.VtbElementUnit {
    title: string;
    participant_prices: Array<VtbParticipantPrice>;
    quantity: number;
    private _hash;
    get id(): string;
    get participants(): Array<number>;
}
export declare class VtbElement implements interfaces.VtbElement {
    id: string;
    object_id?: string;
    ts_product_id: number;
    title: string;
    subtitle: string;
    description: string;
    additional_description: string;
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
    _units: Array<VtbElementUnit>;
    private _grouped;
    get units(): Array<VtbElementUnit>;
    get participants(): Array<number>;
    get last_day(): number;
    get days(): number;
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