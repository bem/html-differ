const utils = require('./utils');

/**
 * Serializes HTML elements back to raw HTML
 */
module.exports = {
  /**
     * @param {String} name
     * @param {String} publicId
     * @param {String} systemId
     * @returns {String}
     */
  doctype: function(name, publicId, systemId) {
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
  },
  /**
     * @param {String} tagName
     * @param {Array} attrs
     * @param {Boolean} selfClosing
     * @returns {String}
     */
  startTag: function(tagName, attrs, selfClosing) {
    let res = '<' + tagName;

    attrs.forEach(function(attr) {
      res += ' ' + attr.name + '="' + utils.htmlEntities(attr.value) + '"';
    });

    selfClosing && (res += '/');

    return res + '>';
  },
  /**
     * @param {String} tagName
     * @returns {String}
     */
  endTag: function(tagName) {
    return '</' + tagName + '>';
  },
  /**
     * @param {String} text
     * @returns {String}
     */
  text: function(text) {
    return utils.htmlEntities(text);
  },
  /**
     * @param {String} text
     * @returns {String}
     */
  comment: function(text) {
    return '<!--' + text + '-->';
  }
};
