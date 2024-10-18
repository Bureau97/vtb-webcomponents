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