/**

// vtb-webcomponents/src/utils/currency.ts

Copyright 2024 Huub Segers - B97

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


@description
Currency formatter for numbers to be displayed as a localized string
defaults to nl-NL and Euro

@version 1.0.0
@since 1.0.0
@license MIT
@see https://github.com/huubsegers/vtb-webcomponents

*/
/**
 * @name currency
 *
 * @description
 * Currency formatter for numbers to be displayed as a localized string
 * defaults to nl-NL and Euro
 *
 * @example
 * import { currency } from 'vtb-webcomponents/utils/currency.js';
 *
 * currency(1000, 'en-US', 'USD');  // displays $1,000.00
 *
 * @example
 * import { currency } from 'vtb-webcomponents/utils/currency.js';
 *
 * currency(1000);  // displays € 1.000,00
 *
 *
 * @param {number | null} value
 * @param {string} [locale='nl-NL']
 * @param {string} [currency='EUR']
 *
 * @returns {string}
 */
export declare function currency(value: number | null, locale?: string, currency?: string): string;
//# sourceMappingURL=currency.d.ts.map