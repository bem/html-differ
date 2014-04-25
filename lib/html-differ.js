require('colors');

var jsdiff = require('diff'),
    htmlparser = require('htmlparser'),
    toHtml = require('htmlparser-to-html');

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

    var parsedHtml1 = htmlToTree(html1),
        parsedHtml2 = htmlToTree(html2),

        first = treeToHtml(transform(parsedHtml1)),
        second = treeToHtml(transform(parsedHtml2)),

        diff = jsdiff.diffWords(first, second),
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
