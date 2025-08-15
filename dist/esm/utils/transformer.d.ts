import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbElementUnit, VtbExtraField } from '../models.js';
import { VtbConfig } from './interfaces.js';
export declare class VtbDataTransformer {
    private _data;
    private _config?;
    constructor(vtb_config?: VtbConfig);
    parse_vtb_data(vtbSrcData: any): VtbTravelPlanData;
    protected parse_extra_field(field: any): VtbExtraField;
    protected parse_carrental_elements(segment_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any,
    segment_parent_data: any): void;
    protected parse_flight_info(segment_data: any): void;
    protected parse_vtb_segment(segment_data: any): VtbElementGroup;
    private re_body;
    private re_style;
    protected parse_vtb_element_unit(element_data: any): VtbElementUnit;
    protected parse_vtb_element(element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle?: string): VtbElement;
}
//# sourceMappingURL=transformer.d.ts.map