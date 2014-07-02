var diff = require('diff'),
    htmlparser = require('htmlparser'),
    toHtml = require('htmlparser-to-html');

var Diff = diff.Diff;

var HtmlDiff = function(options) {
    options = options || {};

    this.ignoreWhitespace = true;
    this.ignoreHtmlAttrs = options.ignoreHtmlAttrs || [];
    this.compareHtmlAttrsAsJSON = options.compareHtmlAttrsAsJSON || [];
};

HtmlDiff.prototype = Diff.prototype;

HtmlDiff.prototype.tokenize = function(value) {

    value = treeToHtml(transform(htmlToTree(value), this.ignoreHtmlAttrs, this.compareHtmlAttrsAsJSON))
                .replace(/\&amp;quot;/g, '\&quot;'); // Bug in 'html-parser-to-html'. String '&quot;' is converted into '&amp;quot;'

    return removeEmpty(value.split(/(\s+|\b)/));
};

function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            ret.push(array[i]);
        }
    }
    return ret;
}

function htmlToTree(rawHtml) {
    var handler = new htmlparser.DefaultHandler(function(err, dom) {
        if (err) console.log(err);
    }, { verbose: true, ignoreWhitespace: true });

    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(rawHtml);

    return handler.dom;
}

function transform(tree, ignoreHtmlAttrs, compareHtmlAttrsAsJSON) {

    function sortObj(obj) {
        var sortedKeys = [],
            sortedObj = {};

        Object.keys(obj).forEach(function(key) {
            sortedKeys.push(key);
        });

        sortedKeys.sort();

        sortedKeys.forEach(function(key) {
            sortedObj[key] = obj[key];
        });

        return sortedObj;
    }

    function sortContent(val) {
        if (typeof val === 'object' && val.length === undefined) {
            val = sortObj(val);

            Object.keys(val).forEach(function(key) {
                val[key] = sortContent(val[key]);
            });
        }

        return val;
    }

    function parseAttr(val, isClick) {
        if (isClick) {
            var fn = Function(val);
            return fn ? fn() : {};
        }

        return JSON.parse(val);
    }

    tree.map(function(node) {
        Object.keys(node).forEach(function(leaf) {
            if (leaf === 'attribs') {
                var attrs = node[leaf];

                attrs = sortObj(attrs);

                attrs.hasOwnProperty('class') &&
                    (attrs['class'] = attrs['class'].split(' ')
                        .filter(function(i) { return i; }).sort().join(' '));

                compareHtmlAttrsAsJSON.forEach(function(attr) {
                    var isClick = (attr === 'onclick' || attr === 'ondblclick');

                    attrs.hasOwnProperty(attr) &&
                        (attrs[attr] = (isClick ? 'return ' : '') +
                            JSON
                                .stringify(sortContent(parseAttr(attrs[attr].replace(/\&quot;/g, '\"'), isClick)), null, '')
                                .replace(/\"/g, '\&quot;'));
                });

                ignoreHtmlAttrs.forEach(function(attr) {
                    attrs.hasOwnProperty(attr) && (attrs[attr] = '');
                });

                node[leaf] = attrs;
            }
            else if (leaf === 'children') {
                transform(node.children, ignoreHtmlAttrs, compareHtmlAttrsAsJSON);
            }
        });
    });

    return tree;
}

function treeToHtml(tree) {
    return toHtml(tree);
}

function diffHtml(html1, html2, options) {
    var htmlDiffer = new HtmlDiff(options);

    return htmlDiffer.diff(html1, html2);
}

function bemDiff(html1, html2) {
    var diffLogger = require('./diff-logger'),
        differOpts = { ignoreHtmlAttrs: ['id', 'for'], compareHtmlAttrsAsJSON: ['data-bem', 'onclick', 'ondblclick'] },
        loggerOpts = { showCharacters: 20 },

        htmlDiffer = new HtmlDiff(differOpts);

    diffLogger.log(htmlDiffer.diff(html1, html2), loggerOpts);
}

function isEqual(html1, html2, options) {
    diff = this.diffHtml(html1, html2, options);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
}

exports.HtmlDiff = HtmlDiff;
exports.diffHtml = diffHtml;
exports.bemDiff = bemDiff;
exports.isEqual = isEqual;
