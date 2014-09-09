var defaults = require('./defaults'),
    diff = require('diff'),

    /**
     * @class HtmlDiff
     * @constructor
     * @augments Diff
     * @param {Object} [options]
     * @param {String[]} [options.ignoreAttributes]
     * @param {String[]} [options.compareAttributesAsJSON]
     * @param {Boolean} [options.ignoreWhitespaces=true]
     * @param {Boolean} [options.ignoreComments]
     */
    HtmlDiff = function (options) {
        this.options = defaults(options);
    },
    /**
     * @class Diff
     * @constructor
     */
    Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

module.exports = HtmlDiff;
