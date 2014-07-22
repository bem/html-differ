var utils = require('./utils'),

    diff = require('diff'),
    htmlParser = require('htmlparser'),
    AST2Html = require('htmlparser-to-html'),
    _ = require('lodash');

/**
 * Converts the HTML document to the AST Tree
 * @param {String} HTMLDoc
 * @param {Object} options
 * @returns {AST}
 */
function htmlToAST(HTMLDoc, options) {
    var parser,
        parserHandler;

    parserHandler = new htmlParser.DefaultHandler(function(err) {
        if (err) console.log(err);
    }, options);

    parser = new htmlParser.Parser(parserHandler);
    parser.parseComplete(HTMLDoc);

    return parserHandler.dom;
}

/**
 * Recursively sorts arttibutes' values of the AST leafs
 * @param {AST} tree
 * @param {Object} options
 * @returns {AST}
 */
function modifyASTTree(tree, options) {
    _.each(tree, function(node) {
        Object.keys(node).forEach(function(leaf) {
            if (leaf === 'attribs') {
                var attrs = utils.sortObj(node[leaf]);

                if (attrs.hasOwnProperty('class')) {
                    attrs['class'] = utils.sortCssClasses(attrs['class']);
                }

                _.each(options.compareHtmlAttrsAsJSON, function(attr) {
                    var attrValue,
                        isFunction = (attr === 'onclick' || attr === 'ondblclick'); // @FIXME: should be configurable

                    if (attrs.hasOwnProperty(attr)) {

                        attrValue = utils.parseAttr(attrs[attr].replace(/&quot;/g, '"'), isFunction);
                        attrValue = utils.sortObj(attrValue);
                        attrValue = JSON.stringify(attrValue);

                        attrs[attr] = (isFunction ? 'return ' : '') + attrValue.replace(/"/g, '&quot;')
                    }
                });

                _.each(options.ignoreHtmlAttrs, function(attr) {
                    attrs.hasOwnProperty(attr) && (attrs[attr] = '');
                });

                node[leaf] = attrs;
            }
            else if (leaf === 'children') {
                modifyASTTree(node.children, options);
            }
        });
    });

    return tree;
}

/**
 *
 * @param [options]
 * @param {String[]} [options.ignoreHtmlAttrs]
 * @param {String[]} [options.compareHtmlAttrsAsJSON]
 * @param {Boolean} [options.verbose]
 * @param {Boolean} [options.ignoreWhitespace=true]
 * @param {Boolean} [options.bem=false]
 * @constructor
 */
var HtmlDiff = function(options) {
    this.options = utils.defaults(options);
};

var Diff = diff.Diff;

HtmlDiff.prototype = Diff.prototype;

/**
 * Tokenizes the given string
 * @param {String} value
 * @returns {Array}
 */
HtmlDiff.prototype.tokenize = function(value) {
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
 *
 * @param [options]
 * @param {String[]} [options.ignoreHtmlAttrs]
 * @param {String[]} [options.compareHtmlAttrsAsJSON]
 * @param {Boolean} [options.verbose]
 * @param {Boolean} [options.ignoreWhitespace=true]
 * @param {Boolean} [options.bem=false]
 * @constructor
 */
var HtmlDiffer = function(options) {
    options = utils.defaults(options);

    if (options['bem']) {
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
HtmlDiffer.prototype.diffHtml = function(html1, html2, options) {
    if (options) {
        console.warn('WARNING! The third param of \'diffHtml\' method is deprecated!');
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
HtmlDiffer.prototype.isEqual = function(html1, html2, options) {
    if (options) {
        console.warn('WARNING! The third param of \'isEqual\' method is deprecated!');
    }

    options = _.defaults(this.options, options);

    var htmlDiffer = new HtmlDiff(options),
        diff = htmlDiffer.diff(html1, html2);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
};

/**
 * @deprecated
 * @param {String} html1
 * @param {String} html2
 */
function bemDiff(html1, html2) {
    console.warn('WARNING! You use deprecated method \'bemDiff\'!');

    var logger = require('./diff-logger'),
        options = {
            ignoreHtmlAttrs: ['id', 'for'],
            compareHtmlAttrsAsJSON: ['data-bem', 'onclick', 'ondblclick']
        },
        loggerOptions = {
            showCharacters: 40
        },

        htmlDiffer = new HtmlDiff(options);

    logger.log(htmlDiffer.diff(html1, html2), loggerOptions);
}


var htmlDiffer = new HtmlDiffer();

module.exports = {
    HtmlDiff: HtmlDiff,
    HtmlDiffer: HtmlDiffer,
    diffHtml: htmlDiffer.diffHtml.bind(htmlDiffer),
    isEqual: htmlDiffer.isEqual.bind(htmlDiffer),

    bemDiff: bemDiff
};
