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