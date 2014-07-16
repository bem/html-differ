var fs = require('fs'),
    HtmlDiffer = require('../lib/index').HtmlDiffer;

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/fixtures/' + f1, 'utf-8');
    files.html2 = fs.readFileSync('test/fixtures/' + f2, 'utf-8');

    return files;
}

describe('\'diffHtml\'', function () {

    it('must not be diffs', function () {
        var htmlDiffer = new HtmlDiffer(),

            files = readFiles('1.html', '_1.html'),

            res = [ {
                value: '<!DOCTYPE html>\n<html>\n<head lang="en">\n    <meta charset="UTF-8">\n    <title></title>\n</head>\n<body>\nText\n</body>\n</html>\n'
            } ];

        htmlDiffer.diffHtml(files.html1, files.html2).must.be.eql(res);
    });

    it('must be diffs', function () {
        var htmlDiffer = new HtmlDiffer(),

            files = readFiles('2.html', '_2.html'),

            res = [ {
                value: '<!DOCTYPE html><html><head lang="en"><meta charset="UTF-8"><title></title></head><body>\n',
                added: undefined,
                removed: undefined
            }, {
                value: '!',
                added: true,
                removed: undefined
            }, {
                value: 'Text',
                added: undefined,
                removed: undefined
            }, {
                value: '!',
                added: true,
                removed: undefined
            }, {
                value: '\n</body></html>',
                added: undefined,
                removed: undefined
            } ];

        htmlDiffer.diffHtml(files.html1, files.html2).must.be.eql(res);
    });

    it('must set options', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreHtmlAttrs: ['id', 'for'] }),

            files = readFiles('3.html', '_3.html'),

            res = [ {
                value: '<html><head><title>Test</title></head><body><label for="">label for input</label><input id=""></body></html>',
                added: undefined,
                removed: undefined
            } ];

        htmlDiffer.diffHtml(files.html1, files.html2).must.be.eql(res);
    });

});
