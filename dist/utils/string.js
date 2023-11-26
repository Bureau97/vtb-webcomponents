export function strip_tags(html) {
    if (!html) {
        return '';
    }
    html = String(html).replace(/<\/?[^>]+(>|$)/g, '');
    html = html.replace(/&nbsp;/g, ' ');
    return html;
}
//# sourceMappingURL=string.js.map