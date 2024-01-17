import { LitElement } from 'lit';
import { TemplateResult } from 'lit-element';
import { VtbElement } from '../models.js';
export declare class VtbCalculatorPriceElement extends LitElement {
    static styles: import("lit").CSSResult;
    locale: string;
    currency: string;
    price: number;
    price_type: string;
    display_price: boolean | string;
    display_prices_if_zero: boolean;
    render(): TemplateResult<1>;
}
export declare class VtbCalculatorPriceListElement extends LitElement {
    static styles: import("lit").CSSResult;
    calculate_totals: boolean;
    display_totals: boolean;
    display_prices: boolean;
    display_prices_if_zero: boolean;
    locale: string;
    currency: string;
    total_price: number;
    render(): TemplateResult<1>;
}
export declare class VtbCalculatorElement extends LitElement {
    static styles: import("lit").CSSResult;
    calculate_totals: boolean;
    display_totals: boolean;
    display_element_prices: boolean;
    locale: string;
    currency: string;
    total_price: number;
    custom_styles: string;
    elements: Array<VtbElement>;
    groups: string[];
    show_per_participant: boolean;
    render(): TemplateResult<1>;
    private render_totals;
    render_element_description(element: VtbElement): string;
    get_element_price(element: VtbElement): string;
    private _render_elements;
    private _render_price_list;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-calculator': VtbCalculatorElement;
        'vtb-calculator-list': VtbCalculatorPriceListElement;
        'vtb-calculator-element': VtbCalculatorPriceElement;
    }
}
//# sourceMappingURL=calculator.d.ts.map