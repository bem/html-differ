var _ = require('lodash'),
    HtmlDiff = require('./HtmlDiff'),
    modifyHtmlAccordingToOptions = require('./utils/modify'),
    defaults = require('./defaults'),
    handleMasks = require('./utils/mask');

/**
 * Tokenizes the given HTML
 * @param {String} html
 * @returns {Array}
 */
HtmlDiff.prototype.tokenize = function (html) {
    html = modifyHtmlAccordingToOptions(html, this.options);

    return _.filter(html.split(/({{.+?}}(?!})|[{}\(\)\[\]#\*`=:;,.<>"'\/]|\s+)/));
};

/**
 * @class HtmlDiffer
 * @constructor
 * @param {Object}   [options]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments=true]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreDuplicateAttributes=false]
 */
var HtmlDiffer = function (options) {
    options = defaults(options);

    this.options = options;
};

/**
 * Returns the diff between two given chunks of HTML
 * @class HtmlDiffer
 * @method
 * @param {String} html1
 * @param {String} html2
 * @returns {Diff}
 */
HtmlDiffer.prototype.diffHtml = function (html1, html2) {
    var htmlDiffer = new HtmlDiff(this.options),
        diff = htmlDiffer.diff(html1, html2);

    return handleMasks(diff);
};

/**
 * Compares two given chunks of HTML
 * @class HtmlDiffer
 * @method
 * @param {String} html1
 * @param {String} html2
 * @returns {Boolean}
 */
HtmlDiffer.prototype.isEqual = function (html1, html2) {
    var diff = this.diffHtml(html1, html2);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
};

var htmlDiffer = new HtmlDiffer();

module.exports = {
    HtmlDiffer: HtmlDiffer,
    diffHtml: htmlDiffer.diffHtml.bind(htmlDiffer),
    isEqual: htmlDiffer.isEqual.bind(htmlDiffer)
};
