require('colors');

var diff = require('diff'),
    htmlparser = require('htmlparser'),
    toHtml = require('htmlparser-to-html');

var Diff = diff.Diff;

var HtmlDiff = new Diff(true);

HtmlDiff.tokenize = function(value) {

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

exports.compare = function(html1, html2, needLog) {

    diff = HtmlDiff.diff(html1, html2);

    isEqual = true,
    output = '';

    diff.forEach(function(part) {
        var color = part.added ? 'green' :
                part.removed ? 'red' : 'grey',
            indexOfPart = diff.indexOf(part);

        if (color === 'red' || color === 'green') {
            isEqual = false;

            output += (!indexOfPart ? '\n' : '') +  part.value[color];

            return;
        }

        if (part.value.length < 40) {
            output += (indexOfPart > 0 ? '' : '\n') + part.value.grey;
        } else {
            indexOfPart > 0 && (output += part.value.substr(0, 20).grey);

            if (indexOfPart < diff.length - 1) {
                output += '\n...\n' + part.value.substr(part.value.length - 20, 20).grey;
            }
        }
    });

    if (!isEqual && needLog) console.log('Differences:' + output);

    return isEqual;
}
