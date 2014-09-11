var fs = require('fs'),
    HtmlDiffer = require('../../lib/index').HtmlDiffer;

function readFiles(f) {
    var files = {};

    files.html1 = fs.readFileSync('test/diff/fixtures/first/' + f + '.html', 'utf-8');
    files.html2 = fs.readFileSync('test/diff/fixtures/second/' + f + '.html', 'utf-8');

    return files;
}

describe('\'isEqual\'', function () {
    it('must be equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('equal');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must be not equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('not-equal');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must consider uppercase and lowercase declarations in \'doctype\' to be equal', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('doctype');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort attributes', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('sort-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort classes\' values', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('sort-classes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort values of attributes as JSON', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: [ 'a', 'b' ] }),
            files = readFiles('sort-values-in-json-format');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort values of attributes \'onclick\' and \'ondblclick\' as JSON', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: [ 'onclick', 'ondblclick' ] }),
            files = readFiles('onclick-and-ondblclick');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreAttributes\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'] }),
            files = readFiles('ignore-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreWhitespaces\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreWhitespaces: true }),
            files = readFiles('ignore-whitespaces');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreComments\'', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('ignore-comments');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreClosingTags\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreClosingTags: true }),
            files = readFiles('ignore-closing-tags');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreDuplicateAttributes\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreDuplicateAttributes: true }),
            files = readFiles('ignore-duplicate-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must not ignore duplicate attributes', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreDuplicateAttributes: false }),
            files = readFiles('ignore-duplicate-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must work preset \'bem\'', function () {
        var htmlDiffer = new HtmlDiffer('bem'),
            files = readFiles('bem-preset');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });
});
