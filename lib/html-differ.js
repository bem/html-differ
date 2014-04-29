var diff = require('diff'),
    htmlparser = require('htmlparser'),
    toHtml = require('htmlparser-to-html');

var Diff = diff.Diff;

var HtmlDiff = function(options) {
    options = options || {};

    this.ignoreWhitespace = true;
    this.ignoreHtmlAttrs = options.ignoreHtmlAttrs || [];
};

HtmlDiff.prototype = Diff.prototype;

HtmlDiff.prototype.tokenize = function(value) {

    value = treeToHtml(transform(htmlToTree(value), this.ignoreHtmlAttrs));

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
    }, { verbose: true, ignoreWhitespace: false });

    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(rawHtml);

    return handler.dom;
}

function transform(tree, ignoreHtmlAttrs) {

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

    tree.map(function(node) {
        Object.keys(node).forEach(function(leaf) {
            if (leaf === 'attribs') {
                node[leaf] = sortObj(node[leaf]);

                node[leaf].hasOwnProperty('class') &&
                    (node[leaf]['class'] = node[leaf]['class'].split(' ')
                        .filter(function(i) { return i; }).sort().join(' '));

                ignoreHtmlAttrs.forEach(function(attr) {
                    node[leaf].hasOwnProperty(attr) && (node[leaf][attr] = '');
                });
            }
            else if (leaf === 'children') {
                transform(node.children, ignoreHtmlAttrs);
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

function isEqual(html1, html2, options) {
    diff = this.diffHtml(html1, html2, options);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
}

exports.HtmlDiff = HtmlDiff;
exports.diffHtml = diffHtml;
exports.isEqual = isEqual;
