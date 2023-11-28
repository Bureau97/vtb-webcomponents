import { LitElement } from 'lit';
import { TemplateResult } from 'lit-element';
import 'dayjs/esm/locale/nl.js';
import { VtbFlightData } from '../models.js';
export interface VtbFlightScheduleOptions {
    dateformat?: string;
}
declare class VtbBaseFlightElement extends LitElement {
    IATA?: string;
    date?: string;
    time?: string;
    timezone: string;
    dateformat: string;
    country?: string;
    city?: string;
    type: string;
    static styles: import("lit").CSSResult;
    render(): TemplateResult<1>;
}
export declare class VtbFlightDepartureElement extends VtbBaseFlightElement {
    type: string;
}
export declare class VtbFlightArrivalElement extends VtbBaseFlightElement {
    type: string;
}
export declare class VtbFlightElement extends LitElement {
    flightnumber?: string;
    carrier?: string;
    carrier_code?: string;
    duration?: string;
    static styles: import("lit").CSSResult;
    render(): TemplateResult<1>;
    render_carrier(): "" | TemplateResult<1>;
    render_duration(): "" | TemplateResult<1>;
    render_flightnumber(): "" | TemplateResult<1>;
}
export declare class VtbFlightScheduleElement extends LitElement {
    flightinfo: Array<VtbFlightData>;
    dateformat: string;
    constructor();
    connectedCallback(): void;
    render(): TemplateResult<1>;
    private _renderFlightInfo;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-flightschedule': VtbFlightScheduleElement;
        'vtb-flight-element': VtbFlightElement;
        'vtb-flight-departure': VtbFlightDepartureElement;
        'vtb-flight-arrival': VtbFlightArrivalElement;
    }
}
export {};
//# sourceMappingURL=flightschedule.d.ts.map