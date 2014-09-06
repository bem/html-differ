var utils = require('./utils'),
    diff = require('diff'),

    /**
     *
     * @param {Object} [options]
     * @param {String[]} [options.ignoreHtmlAttrs]
     * @param {String[]} [options.compareHtmlAttrsAsJSON]
     * @param {Boolean} [options.verbose]
     * @param {Boolean} [options.ignoreWhitespaces=true]
     * @param {Boolean} [options.bem=false]
     * @constructor
     */
    HtmlDiff = function (options) {
        this.options = utils.defaults(options);
    },
    Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

module.exports = HtmlDiff;
