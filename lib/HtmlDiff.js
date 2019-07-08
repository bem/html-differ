const diff = require('diff');
const defaults = require('./defaults');

/**
 * @class HtmlDiff
 * @constructor
 * @augments Diff
 * @param {Object|String} [options] options or preset name
 * @param {String}   [options.preset]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments=true]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreDuplicateAttributes=false]
 * @param {Boolean}  [options.ignoreSelfClosingSlash=false]
 */
const HtmlDiff = function(options) {
  this.options = defaults(options);
};

/**
 * @class Diff
 * @constructor
 */
const Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

module.exports = HtmlDiff;
