var _ = require('lodash');

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
    doctype: function (name, publicId, systemId) {
        if (!name) return '<!DOCTYPE>';

        publicId = publicId || '',
        systemId = systemId || '';

        var res = '<!DOCTYPE ' + name.toUpperCase();

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
    startTag: function (tagName, attrs, selfClosing) {
        var res = '<' + tagName;

        attrs.forEach(function (attr) {
            res += ' ' + attr.name + '="' + _.escape(attr.value) + '"';
        });

        selfClosing && (res += '/');

        return res + '>';
    },
    /**
     * @param {String} tagName
     * @returns {String}
     */
    endTag: function (tagName) {
        return '</' + tagName + '>';
    },
    /**
     * @param {String} text
     * @returns {String}
     */
    text: function (text) {
        return _.escape(text);
    },
    /**
     * @param {String} text
     * @returns {String}
     */
    comment: function (text) {
        return '<!--' + text + '-->';
    }
};
