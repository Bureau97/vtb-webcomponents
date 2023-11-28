import { VtbFilterConfig } from './utils/interfaces';
import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbMapMarkerGroup, VtbExtraField, VtbParticipant } from './models';
import { VtbMapElement, VtbMapOptions } from './components/map';
import { VtbFlightScheduleElement, VtbFlightScheduleOptions } from './components/flightschedule';
export declare class Vtb {
    private _data;
    constructor(vtb_parsed_data?: VtbTravelPlanData);
    get title(): any;
    get subtitle(): any;
    get covers(): any;
    get startdate(): any;
    get enddate(): any;
    get duration(): any;
    get days(): any;
    get nights(): number;
    get sales_price(): any;
    get has_flightinfo(): boolean;
    get flight_info(): any;
    get participants(): Array<VtbParticipant>;
    get parties(): any;
    get flightinfo(): any;
    get carrental(): any;
    get extra_fields(): any;
    extra_field(name: string): VtbExtraField | null;
    extraField(name: string): VtbExtraField | null;
    private _get_element_groups_cache;
    get element_groups(): Array<VtbElementGroup>;
    load(travelplan_source_url: string): Promise<Vtb>;
    parse_vtb_data(vtbSrcData: any): void;
    filter_groups(config: VtbFilterConfig): Array<VtbElementGroup>;
    filter_elements(config?: VtbFilterConfig): Array<VtbElement>;
    calculate_price(config?: VtbFilterConfig, elements?: Array<VtbElement>): number;
    map(container_id: string, filter_config: VtbFilterConfig, map_options: VtbMapOptions): VtbMapElement;
    filter_mapmarkers(config: VtbFilterConfig): VtbMapMarkerGroup;
    flightschedule(container_id: string, filter_config?: VtbFilterConfig, flightschedule_options?: VtbFlightScheduleOptions): VtbFlightScheduleElement;
}
//# sourceMappingURL=vtb.d.ts.map