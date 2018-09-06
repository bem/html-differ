var SAXParser = require('parse5-sax-parser'),
    serialize = require('./serialize'),
    utils = require('./utils'),
    Readable = require('stream').Readable;

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
 * @param {Boolean}  [options.ignoreSelfClosingSlash=false]
 * returns {String}
 */
function modify(value, options, callback) {
    var modifiedValue = '',
        parser = new SAXParser(),
        stream = new Readable();

    /**
     * @param {object} doctypeToken
     * @param {String} doctypeToken.name
     * @param {String} doctypeToken.publicId
     * @param {String} doctypeToken.systemId
     */
    parser.on("doctype", function (doctypeToken) {
        var name = doctypeToken.name;
        var publicId = doctypeToken.publicId;
        var systemId = doctypeToken.systemId;

        modifiedValue += serialize.doctype(name, publicId, systemId);
    });

    /**
     * @param {object} startTagToken
     * @param {String} startTagToken.tagName
     * @param {Array} startTagToken.attrs
     * @param {Boolean} startTagToken.selfClosing
     */
    parser.on("startTag", function (startTagToken) {
        var attrs = startTagToken.attrs;
        var selfClosing = startTagToken.selfClosing;
        var tagName = startTagToken.tagName;

        if (options.ignoreDuplicateAttributes) {
            attrs = utils.removeDuplicateAttributes(attrs);
        }
        if (options.ignoreSelfClosingSlash) {
            selfClosing = false;
        }

        attrs = utils.sortAttrs(attrs) &&
                    utils.sortCssClasses(attrs) &&
                        utils.sortAttrsValues(attrs, options.compareAttributesAsJSON) &&
                            utils.removeAttrsValues(attrs, options.ignoreAttributes);

        modifiedValue += serialize.startTag(tagName, attrs, selfClosing);
    });

    /**
     * @param {object} endTagToken
     * @param {String} endTagToken.tagName
     */
    parser.on("endTag", function (endTagToken) {
        var tagName = endTagToken.tagName;

        !options.ignoreEndTags && (modifiedValue += serialize.endTag(tagName));
    });

    /**
     * @param {object} textToken
     * @param {String} textToken.text
     */
    parser.on("text", function (textToken) {
        var text = textToken.text;

        options.ignoreWhitespaces && (text = utils.removeWhitespaces(text));

        modifiedValue += serialize.text(text);
    });

    /**
     * @param {object} commentToken
     * @param {String} commentToken.text
     */
    parser.on("comment", function (commentToken) {
        var comment = commentToken.comment;

        var conditionalComment = utils.getConditionalComment(comment, modify, options);

        if (conditionalComment) {
            modifiedValue += serialize.comment(conditionalComment);
        } else if (!options.ignoreComments) {
            modifiedValue += serialize.comment(comment);
        }
    });

    parser.on("end", function () {
        callback(modifiedValue);
    });

    // Makes 'parse5' handle duplicate attributes
    parser._reset = function (html) {
        SAXParser.prototype._reset.call(this, html);
        this.tokenizerProxy.tokenizer._isDuplicateAttr = function () {
            return false;
        };
    };

    stream.push(value);
    stream.push(null);
    stream.pipe(parser);
}

module.exports = modify;
