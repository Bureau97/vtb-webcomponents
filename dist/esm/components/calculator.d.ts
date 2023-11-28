import { LitElement } from 'lit';
import { TemplateResult } from 'lit-element';
import { VtbElement } from '../models';
export declare class VtbCalculatorPriceElement extends LitElement {
    static styles: import("lit").CSSResult;
    locale: string;
    currency: string;
    price: number;
    priceType: string;
    displayPrice: boolean | string;
    displayPricesIfZero: boolean;
    render(): TemplateResult<1>;
}
export declare class VtbCalculatorPriceListElement extends LitElement {
    static styles: import("lit").CSSResult;
    calculateTotals: boolean;
    displayTotals: boolean;
    displayPrices: boolean;
    displayPricesIfZero: boolean;
    locale: string;
    currency: string;
    totalPrice: number;
    render(): TemplateResult<1>;
}
export declare class VtbCalculatorElement extends LitElement {
    static styles: import("lit").CSSResult;
    calculateTotals: boolean;
    displayTotals: boolean;
    locale: string;
    currency: string;
    totalPrice: number;
    customStyles: string;
    priceData?: Array<VtbElement>;
    groups: string[];
    showPerParticipant: boolean;
    render(): TemplateResult<1>;
    private renderTotals;
    renderElementDescription(element: VtbElement): string;
    getElementPrice(element: VtbElement): string;
    private _renderPriceData;
    private _renderPriceList;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-calculator': VtbCalculatorElement;
        'vtb-calculator-list': VtbCalculatorPriceListElement;
        'vtb-calculator-element': VtbCalculatorPriceElement;
    }
}
//# sourceMappingURL=calculator.d.ts.map