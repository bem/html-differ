var fs = require('fs'),
    HtmlDiffer = require('../lib/index').HtmlDiffer;

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/fixtures/' + f1, 'utf-8');
    files.html2 = fs.readFileSync('test/fixtures/' + f2, 'utf-8');

    return files;
}

describe('\'isEqual\'', function () {
    it('must be equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('1.html', '_1.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must be not equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('2.html', '_2.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must ignore html attrs', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreHtmlAttrs: ['id', 'for'] }),
            files = readFiles('3.html', '_3.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort classes', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('4.html', '_4.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort attrs', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('5.html', '_5.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort content of attrs', function () {
        var htmlDiffer = new HtmlDiffer({ compareHtmlAttrsAsJSON: [ 'a', 'b' ] }),
            files = readFiles('6.html', '_6.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must ignore space characters', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreWhitespaces: true }),
            files = readFiles('7.html', '_7.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort \'onclick\' and \'ondblclick\' attrs content', function () {
        var htmlDiffer = new HtmlDiffer({ compareHtmlAttrsAsJSON: [ 'onclick', 'ondblclick' ] }),
            files = readFiles('8.html', '_8.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work \'bem\' preset', function () {
        var htmlDiffer = new HtmlDiffer('bem'),
            files = readFiles('9.html', '_9.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must ignore html comments', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('10.html', '_10.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });
});
