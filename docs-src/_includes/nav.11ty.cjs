const relative = require('./relative-path.cjs');

module.exports = function ({page}) {
  return `
<nav>
  <a href="${relative(page.url, '/')}">Home</a>
  <a href="${relative(page.url, '/api/')}">API</a>
  <a href="${relative(page.url, '/map/')}">Map</a>
  <a href="${relative(page.url, '/media/')}">Media</a>
  <a href="${relative(page.url, '/text/')}">Text</a>
  <a href="${relative(page.url, '/calculator/')}">Calculator</a>
  <a href="${relative(page.url, '/flightschedule/')}">FLightschedule</a>

  <!-- <a href="${relative(page.url, '/examples/')}">Examples</a> -->
  <!-- <a href="${relative(page.url, '/install/')}">Install</a> -->
</nav>`;
};
