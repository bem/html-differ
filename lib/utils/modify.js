var SimpleApiParser = require('parse5').SimpleApiParser,
    serialize = require('./serialize'),
    utils = require('./utils');

/**
 * Parses the given HTML and modifies it according to the given options
 * @param {String} value
 * @param {Object}   [options]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments=true]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreDuplicateAttributes=false]
 * returns {String}
 */
function modify(value, options) {
    var modifiedValue = '',
        parser;

    parser = new SimpleApiParser({
        /**
         * @param {String} name
         * @param {String} publicId
         * @param {String} systemId
         */
        doctype: function (name, publicId, systemId) {
            modifiedValue += serialize.doctype(name, publicId, systemId);
        },
        /**
         * @param {String} tagName
         * @param {Array} attrs
         * @param {Boolean} selfClosing
         */
        startTag: function (tagName, attrs, selfClosing) {
            if (options.ignoreDuplicateAttributes) {
                attrs = utils.removeDuplicateAttributes(attrs);
            }

            attrs = utils.sortAttrs(attrs) &&
                        utils.sortCssClasses(attrs) &&
                            utils.sortAttrsValues(attrs, options.compareAttributesAsJSON) &&
                                utils.removeAttrsValues(attrs, options.ignoreAttributes);

            modifiedValue += serialize.startTag(tagName, attrs, selfClosing);
        },
        /**
         * @param {String} tagName
         */
        endTag: function (tagName) {
            !options.ignoreEndTags && (modifiedValue += serialize.endTag(tagName));
        },
        /**
         * @param {String} text
         */
        text: function (text) {
            options.ignoreWhitespaces && (text = utils.removeWhitespaces(text));

            modifiedValue += serialize.text(text);
        },
        /**
         * @param {String} comment
         */
        comment: function (comment) {
            var conditionalComment = utils.getConditionalComment(comment, modify, options);

            if (conditionalComment) {
                modifiedValue += serialize.comment(conditionalComment);
            } else if (!options.ignoreComments) {
                modifiedValue += serialize.comment(comment);
            }
        }
    });

    // Makes 'parse5' handle duplicate attributes
    parser._reset = function (html) {
        SimpleApiParser.prototype._reset.call(this, html);
        this.tokenizerProxy.tokenizer._isDuplicateAttr = function () {
            return false;
        };
    };

    parser.parse(value);

    return modifiedValue;
}

module.exports = modify;
