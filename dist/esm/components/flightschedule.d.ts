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