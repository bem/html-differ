const _ = require('lodash');
const HtmlDiff = require('./HtmlDiff');
const modifyHtmlAccordingToOptions = require('./utils/modify');
const defaults = require('./defaults');
const handleMasks = require('./utils/mask');
let htmlDifferOptions = {};
const modifiedTokens = {};

async function saveModifiedTokens(html) {
  const tokens = await modifyHtmlAccordingToOptions(html, htmlDifferOptions);
  modifiedTokens[html] = _.filter(tokens.split(/({{.+?}}(?!})|[{}\(\)\[\]#\*`=:;,.<>"'\/]|\s+)/));
}

/**
 * Tokenizes the given HTML
 * @param {String} html
 * @returns {Array}
 */
HtmlDiff.prototype.tokenize = function(html) {
  return modifiedTokens[html];
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
 * @param {Boolean}  [options.ignoreSelfClosingSlash=false]
 */
const HtmlDiffer = function(options) {
  options = defaults(options);

  htmlDifferOptions = options;
};

/**
 * Returns the diff between two given chunks of HTML
 * @class HtmlDiffer
 * @method
 * @param {String} html1
 * @param {String} html2
 * @returns {Diff}
 */
HtmlDiffer.prototype.diffHtml = async function(html1, html2) {
  await saveModifiedTokens(html1);
  await saveModifiedTokens(html2);

  const htmlDiffer = new HtmlDiff(htmlDifferOptions);
  const diff = htmlDiffer.diff(html1, html2);

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
HtmlDiffer.prototype.isEqual = async function(html1, html2) {
  const diff = await this.diffHtml(html1, html2);

  return (diff.length === 1 && !diff[0].added && !diff[0].removed);
};

const htmlDiffer = new HtmlDiffer();

module.exports = {
  HtmlDiffer: HtmlDiffer,
  diffHtml: htmlDiffer.diffHtml.bind(htmlDiffer),
  isEqual: htmlDiffer.isEqual.bind(htmlDiffer)
};
