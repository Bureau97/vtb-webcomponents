
export function strip_tags(html?: string, excludes?: Array<string>): string {
  if (!html) {
    return '';
  }

  let excl = '';
  if (excludes) {
    excl = '(?:' + excludes.join('|') + ')\w*';
  }

  const re = new RegExp('<\/?' + excl + '[^>]*>', 'gi');
  html = String(html).replace(re, '');
  html = html.replace(/&nbsp;/g, ' ');
  return html;
}
