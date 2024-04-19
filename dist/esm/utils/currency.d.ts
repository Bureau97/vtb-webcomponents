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