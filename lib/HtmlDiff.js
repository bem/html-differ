var utils = require('./utils'),
    diff = require('diff'),

    /**
     * @class HtmlDiff
     * @constructor
     * @augments Diff
     * @param {Object} [options]
     * @param {String[]} [options.ignoreAttributes]
     * @param {String[]} [options.compareHtmlAttrsAsJSON]
     * @param {Boolean} [options.ignoreWhitespaces=true]
     * @param {Boolean} [options.ignoreHtmlComments]
     */
    HtmlDiff = function (options) {
        this.options = utils.defaults(options);
    },
    /**
     * @class Diff
     * @constructor
     */
    Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

module.exports = HtmlDiff;
