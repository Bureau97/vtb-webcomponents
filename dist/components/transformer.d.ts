import {VtbData, VtbElement} from './data';
export declare class VtbDataTransformer {
  private _data;
  parse_vtb_data(vtbSrcData: any): VtbData;
  protected parse_vtb_segment(segment: any): void;
  protected parse_vtb_element(
    element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle?: string
  ): VtbElement;
}
//# sourceMappingURL=transformer.d.ts.map
