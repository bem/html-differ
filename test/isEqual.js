var fs = require('fs'),
    htmlDiffer = require('../lib/html-differ');

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/fixtures/' + f1, 'utf-8'),
    files.html2 = fs.readFileSync('test/fixtures/' + f2, 'utf-8');

    return files;
}

describe('\'isEqual\'', function () {

    it('must be equal', function () {
        var files = readFiles('1.html', '_1.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must be not equal', function () {
        var files = readFiles('2.html', '_2.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must ignore html attrs', function () {
        var files = readFiles('3.html', '_3.html');

        htmlDiffer.isEqual(files.html1, files.html2, { ignoreHtmlAttrs: ['id', 'for'] } ).must.be.true();
    });

    it('must sort class', function () {
        var files = readFiles('4.html', '_4.html');

        htmlDiffer.isEqual(files.html1, files.html2, { ignoreHtmlAttrs: ['id', 'for'] } ).must.be.true();
    });

});
