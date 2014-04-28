require('colors');

var diff = require('diff'),
    htmlparser = require('htmlparser'),
    toHtml = require('htmlparser-to-html');

var Diff = diff.Diff;

var HtmlDiff = function(options) {
    this.ignoreWhitespace = options.ignoreWhitespace || true;
    this.ignoreHtmlAttrs = options.ignoreHtmlAttrs || {};
};

HtmlDiff.prototype = Diff.prototype;

HtmlDiff.prototype.tokenize = function(value) {

    value = htmlToTree(value);

    value = treeToHtml(transform(value));

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

function treeToHtml(tree) {
    return toHtml(tree);
}

function transform(tree) {
    tree.map(function(node) {
        Object.keys(node).forEach(function(leaf) {
            if (leaf === 'attribs') {
                node[leaf].hasOwnProperty('class') &&
                    (node[leaf]['class'] = node[leaf]['class'].split(' ')
                        .filter(function(i) { return i; }).sort().join(' '));

                node[leaf].hasOwnProperty('id') && (node[leaf].id = '');
                node[leaf].hasOwnProperty('for') && (node[leaf]['for'] = '');
            }
            else if (leaf === 'children') {
                transform(node.children);
            }
        });
    });

    return tree;
}

diff.diffHtml = function(html1, html2, options) {

    var htmlDiffer = new HtmlDiff({ ignoreWhitespace: true, ignoreHtmlAttrs: options });

    return htmlDiffer.diff(html1, html2);
}

diff.isEqual = function(html1, html2) {
    diff = this.diffHtml(html1, html2);

    return (diff.length === 1 && !diff[0].added && !diff[0].removed);
}

module.exports = diff;
