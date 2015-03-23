var diff = require('diff'),
    defaults = require('./defaults');

/**
 * @class HtmlDiff
 * @constructor
 * @augments Diff
 * @param {Object|String} [options] options or preset name
 * @param {String}   [options.preset]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreDuplicateAttributes=false]
 */
var HtmlDiff = function (options) {
    this.options = defaults(options);
};

/**
 * @class Diff
 * @constructor
 */
var Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

module.exports = HtmlDiff;
