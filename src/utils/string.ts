
export function strip_tags(html?: string) {
  if (!html) {
    return '';
  }

  html = String(html).replace(/<\/?[^>]+(>|$)/g, '');
  html = html.replace(/&nbsp;/g, ' ');
  return html;
}
