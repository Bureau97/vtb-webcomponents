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
import { LitElement } from 'lit';
import { TemplateResult } from 'lit-element';
import 'dayjs/locale/nl.js';
import { VtbFlightData } from '../models.js';
export interface VtbFlightScheduleOptions {
    dateformat?: string;
}
export declare class VtbFlightScheduleElement extends LitElement {
    static styles: import("lit").CSSResult;
    flightinfo: Array<VtbFlightData>;
    dateformat: string;
    constructor();
    connectedCallback(): void;
    render(): TemplateResult<1>;
    render_airport(airport: string | undefined, IATA: string | undefined): "" | TemplateResult<1>;
    render_carrier(carrier: string | undefined): "" | TemplateResult<1>;
    render_duration(duration: string | undefined): "" | TemplateResult<1>;
    render_flightnumber(flightnumber: string | undefined, carrier_code: string | undefined): "" | TemplateResult<1>;
    render_operatedby(operated_by: string | undefined): "" | TemplateResult<1>;
    private _renderFlightInfo;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-flightschedule': VtbFlightScheduleElement;
    }
}
//# sourceMappingURL=flightschedule.d.ts.map