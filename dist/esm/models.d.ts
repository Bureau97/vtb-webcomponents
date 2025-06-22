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
    id: string;
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
    day?: number | undefined;
    private _hash;
    get id(): string;
    get participants(): Array<number>;
    get subtitle(): string;
    clone(): VtbElementUnit;
}
export declare class VtbElement implements interfaces.VtbElement {
    id: string;
    object_id?: string;
    ts_product_id: number;
    title: string;
    nights: number;
    hidden: boolean;
    day: number;
    startdate: Dayjs;
    enddate: Dayjs;
    unit_id: number;
    participant_prices: Array<VtbParticipantPrice>;
    grouptitle?: string;
    media: Array<VtbMedia>;
    locations: Array<VtbMapMarker>;
    _units: Array<VtbElementUnit>;
    extra_fields: Dictionary<VtbExtraField>;
    private _grouped;
    get units(): Array<VtbElementUnit>;
    get location(): VtbMapMarker | undefined;
    get participants(): Array<number>;
    get last_day(): number;
    get days(): number;
    get price(): number;
    get price_diff(): number;
    get optional(): boolean;
    get subtitle(): string;
    get description(): string;
    set description(text: string);
    get additional_description(): string;
    reset_units(): void;
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
    locations: Array<VtbMapMarker>;
    is_flight: boolean;
    is_carrental: boolean;
    private mapped_elements_by_id;
    private elements_order;
    private mapped_elements_by_type;
    private mapped_elements_by_day;
    get last_day(): number;
    get days(): number;
    get location(): VtbMapMarker | undefined;
    /**
     * Return an array of elements (VtbElement) sorted by their order
     * @returns {Array<VtbElement>}
     */
    get elements(): Array<VtbElement>;
    /**
     * Adds an element to this element group. The element is added to the mapping
     * by its id. If the element has a unit_id, it is added to the mapping for that
     * unit_id. If the element has a day, it is added to the mapping for that day.
     * @param {VtbElement} element Element to add to the element group.
     */
    add_element(element: VtbElement): void;
    /**
     * Filters elements in this element group based on the given configuration.
     *
     * - If `element_unit_ids` is given, only elements with units that have these
     *   ids are returned.
     * - If `participant_ids` is given, only elements with participants that have
     *   these ids are returned.
     * - If `optional` is given, only elements with optional units are returned if
     *   it is set to `true`, or only elements with non-optional units are returned
     *   if it is set to `false`.
     *
     * If participant ids are given, they are checked against the element's participant ids
     * and prices are being filtered as well.
     *
     * @param {VtbFilterConfig} config Configuration for filtering elements.
     * @returns {Array<VtbElement>} Array of filtered elements.
     */
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