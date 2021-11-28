import { HtmlDiff } from './HtmlDiff.js';
import modifyHtmlAccordingToOptions from './utils/modify.js';
import { defaults } from './defaults.js';
import handleMasks from './utils/mask.js';

let htmlDifferOptions = {};
const modifiedTokens = {};

async function saveModifiedTokens(html) {
  const tokens = await modifyHtmlAccordingToOptions(html, htmlDifferOptions);
  modifiedTokens[html] = tokens.split(/({{.+?}}(?!})|[{}\(\)\[\]#\*`=:;,.<>"'\/]|\s+)/).filter(i => i);
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
export class HtmlDiffer {
  constructor(options) {
    options = defaults(options);

    htmlDifferOptions = options;
  }

  /**
   * Returns the diff between two given chunks of HTML
   * @class HtmlDiffer
   * @method
   * @param {String} html1
   * @param {String} html2
   * @returns {Diff}
   */
  async diffHtml(html1, html2) {
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
  async isEqual(html1, html2) {
    const diff = await this.diffHtml(html1, html2);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
  }
}

const htmlDiffer = new HtmlDiffer();

export const diffHtml = htmlDiffer.diffHtml.bind(htmlDiffer);
export const isEqual = htmlDiffer.isEqual.bind(htmlDiffer);
