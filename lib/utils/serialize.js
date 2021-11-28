import * as utils from './utils.js';

/**
 * Serializes HTML elements back to raw HTML
 */

/**
 * @param {String} name
 * @param {String} publicId
 * @param {String} systemId
 * @returns {String}
 */
export function doctype(name, publicId, systemId) {
  if (!name) return '<!DOCTYPE>';

  if (!publicId) {
    publicId = '';
  }
  if (!systemId) {
    systemId = '';
  }

  let res = '<!DOCTYPE ' + name.toUpperCase();

  if (publicId && systemId) {
    res += ' PUBLIC ' + '"' + publicId + '" "' + systemId + '"';
  } else if (publicId) {
    res += ' PUBLIC ' + '"' + publicId + '"';
  } else if (systemId) {
    res += ' SYSTEM ' + '"' + systemId + '"';
  }

  return res + '>';
}
/**
 * @param {String} tagName
 * @param {Array} attrs
 * @param {Boolean} selfClosing
 * @returns {String}
 */
export function startTag(tagName, attrs, selfClosing) {
  let res = '<' + tagName;

  attrs.forEach(function(attr) {
    res += ' ' + attr.name + '="' + utils.htmlEntities(attr.value) + '"';
  });

  selfClosing && (res += '/');

  return res + '>';
}
/**
 * @param {String} tagName
 * @returns {String}
 */
export function endTag(tagName) {
  return '</' + tagName + '>';
}
/**
 * @param {String} text
 * @returns {String}
 */
export function text(text) {
  return utils.htmlEntities(text);
}
/**
 * @param {String} text
 * @returns {String}
 */
export function comment(text) {
  return '<!--' + text + '-->';
}
