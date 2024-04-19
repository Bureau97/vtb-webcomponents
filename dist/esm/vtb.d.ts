import { type Dayjs } from 'dayjs';
import { VtbConfig, VtbFilterConfig } from './utils/interfaces.js';
import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbMapMarkerGroup, VtbExtraField, VtbParticipant, VtbParty, VtbMedia, VtbFlightData } from './models.js';
import { VtbMapElement, VtbMapOptions } from './components/map.js';
import { VtbFlightScheduleElement, VtbFlightScheduleOptions } from './components/flightschedule.js';
export declare class Vtb {
    private _data;
    private _config?;
    /**
     * @constructor
     *
     * @param vtb_config_options VtbConfig
     */
    constructor(vtb_config_options?: VtbConfig);
    /**
     * @property
     *
     * @returns {boolean}
     */
    get is_live_preview(): boolean;
    private get _is_initialized();
    get title(): string;
    get subtitle(): string;
    get covers(): Array<VtbMedia>;
    get startdate(): Dayjs | undefined;
    get enddate(): Dayjs | undefined;
    get duration(): number | undefined;
    get days(): number | undefined;
    get nights(): number | undefined;
    get sales_price(): number | undefined;
    get has_flightinfo(): boolean;
    get flight_info(): VtbFlightData[];
    get participants(): Array<VtbParticipant>;
    get parties(): Array<VtbParty>;
    get flightinfo(): Array<VtbFlightData>;
    get has_carrental(): boolean;
    get carrental(): Array<VtbElement>;
    get extra_fields(): any;
    extra_field(name: string): VtbExtraField | null;
    extraField(name: string): VtbExtraField | null;
    load(travelplan_source_url: string): Promise<Vtb>;
    parse_vtb_data(vtbSrcData: any): void;
    set data(data: VtbTravelPlanData);
    get element_groups(): Array<VtbElementGroup>;
    filter_groups(config: VtbFilterConfig): Array<VtbElementGroup>;
    filter_elements(config?: VtbFilterConfig): Array<VtbElement>;
    calculate_price(config?: VtbFilterConfig, elements?: Array<VtbElement>): number;
    map(container_id: string, filter_config: VtbFilterConfig, map_options: VtbMapOptions): VtbMapElement;
    filter_mapmarkers(config: VtbFilterConfig): VtbMapMarkerGroup;
    flightschedule(container_id: string, filter_config?: VtbFilterConfig, flightschedule_options?: VtbFlightScheduleOptions): VtbFlightScheduleElement;
    /**
     * merge element groups of possibly different types
     * into one with all elements, media en concatted description
     * of those groups
     *
     * @param element_groups
     * @returns
     */
    merge_groups_by_day(element_groups: Array<VtbElementGroup>): Array<VtbElementGroup>;
}
//# sourceMappingURL=vtb.d.ts.map