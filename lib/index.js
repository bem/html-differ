var htmlParser = require('htmlparser2'),
    AST2Html = require('htmlparser-to-html'),
    _ = require('lodash'),
    HtmlDiff = require('./HtmlDiff'),
    utils = require('./utils');

/**
 * Tokenizes the given string
 * @param {String} value
 * @returns {Array}
 */
HtmlDiff.prototype.tokenize = function (value) {
    var options = this.options,
        ASTTree = htmlToAST(value, options);

    ASTTree = modifyASTTree(ASTTree, options);

    /*
     * Bug in 'html-parser-to-html'
     * String '&quot;' is converted into '&amp;quot;'
     * Added issue => github.com/mixu/htmlparser-to-html/issues/1
     */
    value = AST2Html(ASTTree).replace(/&amp;quot;/g, '&quot;');

    return _.filter(value.split(/(\s+|\b)/));
};

/**
 * Converts the HTML document to the AST Tree
 * @param {String} HTMLDoc
 * @returns {AST}
 */
function htmlToAST(HTMLDoc) {
    var parser,
        parserHandler;

    parserHandler = new htmlParser.DomHandler(function (err) {
        if (err) { console.log(err); }
    });

    parser = new htmlParser.Parser(parserHandler);
    parser.parseComplete(HTMLDoc);

    return parserHandler.dom;
}

/**
 * Recursively modifies the tree depending on the given options
 * @param {AST} tree
 * @param {Object} options
 * @returns {AST}
 */
function modifyASTTree(tree, options) {
    var delComments = [];

    _.forEach(tree, function (node) {
        if (options.ignoreWhitespaces && node.type === 'text') {
            node.data = node.data
                .replace(/(\n|\r|\t|\v|\f)+/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            return;
        }

        if (options.ignoreHtmlComments && node.type === 'comment') {
            delComments.push(tree.indexOf(node));

            return;
        }

        if (node.hasOwnProperty('attribs')) {
            var attrs = utils.sortObj(node.attribs);

            if (attrs.hasOwnProperty('class')) {
                attrs['class'] = utils.sortCssClasses(attrs['class']);
            }

            _.forEach(options.compareHtmlAttrsAsJSON, function (attr) {
                var attrValue,
                    isFunction = (attr === 'onclick' || attr === 'ondblclick'); // @FIXME: should be configurable

                if (attrs.hasOwnProperty(attr)) {
                    attrValue = utils.parseAttr(attrs[attr].replace(/&quot;/g, '"'), isFunction);
                    attrValue = utils.sortObj(attrValue);
                    attrValue = JSON.stringify(attrValue);

                    attrs[attr] = (isFunction ? 'return ' : '') + attrValue.replace(/"/g, '&quot;');
                }
            });

            _.forEach(options.ignoreHtmlAttrs, function (attr) {
                attrs.hasOwnProperty(attr) && (attrs[attr] = '');
            });

            node.attribs = attrs;
        }

        if (node.hasOwnProperty('children')) {
            modifyASTTree(node.children, options);
        }
    });

    for (var i = 0; i < delComments.length; i++) {
        tree.splice(delComments[i] - i, 1);
    }

    return tree;
}

/**
 *
 * @param {Object} [options]
 * @param {String[]} [options.ignoreHtmlAttrs]
 * @param {String[]} [options.compareHtmlAttrsAsJSON]
 * @param {Boolean} [options.verbose]
 * @param {Boolean} [options.ignoreWhitespaces=true]
 * @param {Boolean} [options.bem=false]
 * @constructor
 */
var HtmlDiffer = function (options) {
    options = utils.defaults(options);

    if (options.bem) {
        options.ignoreHtmlAttrs = ['id', 'for'];
        options.compareHtmlAttrsAsJSON = ['data-bem', 'onclick', 'ondblclick'];
    }

    this.options = options;
};

/**
 *
 * @param {String} html1
 * @param {String} html2
 * @param {Object} [options]
 * @returns {Diff}
 */
HtmlDiffer.prototype.diffHtml = function (html1, html2, options) {
    if (options) {
        console.warn('WARNING! The third param of \'diffHtml\' method is deprecated!'.bold.red);
    }

    options = _.defaults(this.options, options);

    var htmlDiffer = new HtmlDiff(options);

    return htmlDiffer.diff(html1, html2);
};

/**
 * Compares two given chunks of HTML
 * @param {String} html1
 * @param {String} html2
 * @param {Object} [options]
 * @returns {Boolean}
 */
HtmlDiffer.prototype.isEqual = function (html1, html2, options) {
    if (options) {
        console.warn('WARNING! The third param of \'isEqual\' method is deprecated!'.bold.red);
    }

    options = _.defaults(this.options, options);

    var htmlDiffer = new HtmlDiff(options),
        diff = htmlDiffer.diff(html1, html2);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
};

var htmlDiffer = new HtmlDiffer();

module.exports = {
    HtmlDiffer: HtmlDiffer,
    diffHtml: htmlDiffer.diffHtml.bind(htmlDiffer),
    isEqual: htmlDiffer.isEqual.bind(htmlDiffer)
};
