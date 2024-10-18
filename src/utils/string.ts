export function strip_tags(html?: string, excludes?: Array<string>): string {
  if (!html) {
    return '';
  }

  if (excludes) {
    const re_string = '<((?!/?(' + excludes.join('|') + '))).*?[^>]+>';
    const re = new RegExp(re_string, 'gi');
    html = html.replace(re, '');
  } else {
    html = String(html).replace(/<\/*[^>].*?>/gi, '');
  }

  html = html.replace(/&nbsp;/g, ' ');
  return html;
}
