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