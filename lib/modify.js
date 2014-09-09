var SimpleApiParser = require('parse5').SimpleApiParser,
    serializer = require('./serializer'),
    utils = require('./utils');

/**
 * Parses the given HTML and modifies it according to the given options
 * @param {String} value
 * @param {Object} [options]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean} [options.ignoreWhitespaces=true]
 * @param {Boolean} [options.ignoreComments=true]
 * returns {String}
 */
module.exports = function (value, options) {
    var modifiedValue = '',
        parser;

    parser = new SimpleApiParser({
        /**
         * @param {String} name
         * @param {String} publicId
         * @param {String} systemId
         */
        doctype: function (name, publicId, systemId) {
            modifiedValue += serializer.doctype(name, publicId, systemId);
        },
        /**
         * @param {String} tagName
         * @param {Array} attrs
         * @param {Boolean} selfClosing
         */
        startTag: function (tagName, attrs, selfClosing) {
            attrs = utils.sortAttrs(attrs) &&
                        utils.sortCssClasses(attrs) &&
                            utils.sortAttrsValues(attrs, options.compareAttributesAsJSON) &&
                                utils.ignoreAttrsValues(attrs, options.ignoreAttributes);

            modifiedValue += serializer.startTag(tagName, attrs, selfClosing);
        },
        /**
         * @param {String} tagName
         */
        endTag: function (tagName) {
            !options.ignoreClosingTags && (modifiedValue += serializer.endTag(tagName));
        },
        /**
         * @param {String} text
         */
        text: function (text) {
            options.ignoreWhitespaces && (text = utils.ignoreWhitespaces(text));

            modifiedValue += serializer.text(text);
        },
        /**
         * @param {String} text
         */
        comment: function (text) {
            !options.ignoreComments && (modifiedValue += serializer.comment(text));
        }
    });

    parser.parse(value);

    // Makes 'parse5' handle duplicate attributes
    parser._reset = function (html) {
        SimpleApiParser.prototype._reset.call(this, html);
        this.tokenizerProxy.tokenizer._isDuplicateAttr = function () {
            return false;
        };
    };

    return modifiedValue;
};
