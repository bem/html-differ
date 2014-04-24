require('colors')
var sys = require('sys'),
    jsdiff = require('diff'),
    htmlparser = require("htmlparser"),
    toHtml = require('htmlparser-to-html');

function htmlToTree(rawHtml) {
    var handler = new htmlparser.DefaultHandler(function (err, dom) {
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
                (node[leaf].hasOwnProperty('class')) &&
                    (node[leaf].class = node[leaf].class.split(' ').sort().join(' '));

                node[leaf].hasOwnProperty('id') && (node[leaf].id = '');
            }
            else if (leaf === 'children') {
                transform(node.children);
            }
        });
    });

    return tree;
}

exports.compare = function(first_html, second_html) {

    var parsed_first_html = htmlToTree(first_html),
        parsed_second_html = htmlToTree(second_html);

    //sys.puts(sys.inspect(parsed_first_html, false, null));
    //sys.puts(sys.inspect(parsed_second_html, false, null));

    first = treeToHtml(transform(parsed_first_html));
    second = treeToHtml(transform(parsed_second_html));

    //console.log(first);
    //console.log(second);

    var diff = jsdiff.diffWords(first, second),
        equal = true,
        output = '';


    diff.forEach(function(part) {
        var color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';

        if (color === 'red' || color === 'green') {
            equal = false;

            output += (!diff.indexOf(part) ? '\n' : '') +  part.value[color];
        }
        else {
            if (part.value.length < 40) output += (diff.indexOf(part) > 0 ? '' : '\n') + part.value.grey;
            else {
                diff.indexOf(part) > 0 && (output += part.value.substr(0, 20).grey);

                diff.indexOf(part) < diff.length - 1 && (output += '\n...\n' + part.value.substr(part.value.length - 20, 20).grey);
            }
        }
    });

    if (!equal) console.log('Differences:' + output);
}
