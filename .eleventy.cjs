const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy('docs/docs.css');
    // Return your Object options:
    return {
        dir: {
            input: "docs-src",
            output: "docs"
        }
    }
};
