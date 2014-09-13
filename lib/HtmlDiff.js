var diff = require('diff'),
    defaults = require('./utils/defaults'),

    /**
     * @class HtmlDiff
     * @constructor
     * @augments Diff
     * @param {Object} [options]
     * @param {String[]} [options.ignoreAttributes]
     * @param {String[]} [options.compareAttributesAsJSON]
     * @param {Boolean} [options.ignoreWhitespaces=true]
     * @param {Boolean} [options.ignoreComments]
     * @param {Boolean} [options.ignoreEndTags=false]
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
