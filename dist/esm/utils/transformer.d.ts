import { VtbTravelPlanData, VtbElement, VtbElementGroup } from '../models.js';
export declare class VtbDataTransformer {
    private _data;
    parse_vtb_data(vtbSrcData: any): VtbTravelPlanData;
    protected parse_carrental_elements(segment_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any,
    segment_parent_data: any): void;
    protected parse_flight_info(segment_data: any): void;
    protected parse_vtb_segment(segment_data: any): VtbElementGroup;
    private re_body;
    private re_style;
    protected parse_vtb_element(element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle?: string): VtbElement;
}
//# sourceMappingURL=transformer.d.ts.map