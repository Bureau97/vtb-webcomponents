export function strip_tags(html, excludes) {
    if (!html) {
        return '';
    }
    let excl = '';
    if (excludes) {
        excl = '(?:' + excludes.join('|') + ')w*';
    }
    const re = new RegExp('</?' + excl + '[^>]*>', 'gi');
    html = String(html).replace(re, '');
    html = html.replace(/&nbsp;/g, ' ');
    return html;
}
//# sourceMappingURL=string.js.map