"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strip_tags = void 0;
function strip_tags(html) {
    if (!html) {
        return '';
    }
    html = String(html).replace(/<\/?[^>]+(>|$)/g, '');
    html = html.replace(/&nbsp;/g, ' ');
    return html;
}
exports.strip_tags = strip_tags;
//# sourceMappingURL=string.js.map