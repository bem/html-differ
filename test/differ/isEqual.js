var fs = require('fs'),
    HtmlDiffer = require('../../lib/index').HtmlDiffer;

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/differ/fixtures/' + f1, 'utf-8');
    files.html2 = fs.readFileSync('test/differ/fixtures/' + f2, 'utf-8');

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

    it('must ignore attributes', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'] }),
            files = readFiles('3.html', '_3.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort classes', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('4.html', '_4.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort attributes', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('5.html', '_5.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort content of attributes as JSON', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: [ 'a', 'b' ] }),
            files = readFiles('6.html', '_6.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort \'onclick\' and \'ondblclick\' content as JSON', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: [ 'onclick', 'ondblclick' ] }),
            files = readFiles('8.html', '_8.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must ignore space characters', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreWhitespaces: true }),
            files = readFiles('7.html', '_7.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work \'bem\' preset', function () {
        var htmlDiffer = new HtmlDiffer('bem'),
            files = readFiles('9.html', '_9.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must ignore comments', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('10.html', '_10.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must consider uppercase and lowercase declarations in \'doctype\' to be equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('11.html', '_11.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must ignore closing tags', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreClosingTags: true }),
            files = readFiles('12.html', '_12.html');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });
});
