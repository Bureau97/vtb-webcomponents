/**
 * Strip HTML tags from a string. If `excludes` is provided, the excluded tags will
 * not be stripped.
 *
 * @param {string} [html] The string to strip tags from. If not provided, an empty
 * string will be returned.
 * @param {Array<string>} [excludes] An array of tag names to exclude from stripping.
 * @returns {string} The string with tags stripped.
 */
export function strip_tags(html, excludes) {
    if (!html) {
        return '';
    }
    if (excludes) {
        const re_string = '<((?!/?(' + excludes.join('|') + '))).*?[^>]+>';
        const re = new RegExp(re_string, 'gi');
        html = html.replace(re, '');
    }
    else {
        html = String(html).replace(/<\/*[^>].*?>/gi, '');
    }
    html = html.replace(/&nbsp;/g, ' ');
    return html;
}
//# sourceMappingURL=string.js.map