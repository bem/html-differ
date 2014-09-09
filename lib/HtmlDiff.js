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
     * @param {Boolean} [options.ignoreClosingTags=false]
     * @param {Boolean} [options.ignoreDuplicateAttributes=false]
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
