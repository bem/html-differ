var fs = require('fs'),
    HtmlDiffer = require('../lib/index').HtmlDiffer;

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/fixtures/' + f1, 'utf-8');
    files.html2 = fs.readFileSync('test/fixtures/' + f2, 'utf-8');

    return files;
}

describe('\'diffHtml\'', function () {

    it('must set options', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreHtmlAttrs: ['id', 'for'], ignoreWhitespace: true }),

            files = readFiles('3.html', '_3.html'),

            res = [ {
                value: '<html><head><title>Test</title></head><body><label for="">label for input</label><input id=""></body></html>',
                added: undefined,
                removed: undefined
            } ];

        htmlDiffer.diffHtml(files.html1, files.html2).must.be.eql(res);
    });

});
