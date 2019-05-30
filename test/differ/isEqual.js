var fs = require('fs'),
    path = require('path'),
    fixturesPath = path.join(__dirname, 'fixtures'),
    HtmlDiffer = require('../../lib/index').HtmlDiffer;

/**
 * @param {String} basename
 * @returns {Object}
 */
function readFiles(basename) {
    var fileName = basename + '.html';

    return {
        html1: fs.readFileSync(path.join(fixturesPath, 'first', fileName), 'utf-8'),
        html2: fs.readFileSync(path.join(fixturesPath, 'second', fileName), 'utf-8')
    };
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

    it('must sort values of attributes as JSON when the content is not a function', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['a', { name: 'b', isFunction: false }] }),
            files = readFiles('sort-values-in-json-format');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must handle invalid JSON', function () {
        var htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['data-bem'] }),
            files = readFiles('invalid-json');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must sort values of attributes as JSON when the content is a function', function () {
        var options = {
                compareAttributesAsJSON: [
                    { name: 'onclick', isFunction: true },
                    { name: 'ondblclick', isFunction: true }
                ]
            },
            htmlDiffer = new HtmlDiffer(options),
            files = readFiles('sort-functions-in-json-format');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must handle invalid function', function () {
        var options = { compareAttributesAsJSON: [{ name: 'onclick', isFunction: true }] },
            htmlDiffer = new HtmlDiffer(options),
            files = readFiles('invalid-function');

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

    it('must does NOT work option \'ignoreComments\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreComments: false }),
            files = readFiles('ignore-comments-false');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work option \'ignoreEndTags\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreEndTags: true }),
            files = readFiles('ignore-end-tags');

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

    it('must work option \'ignoreEmptyAttributes\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreEmptyAttributes: true }),
            files = readFiles('ignore-empty-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must not ignore empty attributes', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreEmptyAttributes: false }),
            files = readFiles('ignore-empty-attributes');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must work options \'ignoreAttributes\' and \'ignoreEmptyAttributes\'', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'], ignoreEmptyAttributes: true }),
            files = readFiles('ignore-attributes-empty');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must not ignore attributes', function () {
        var htmlDiffer = new HtmlDiffer({ }),
            files = readFiles('ignore-attributes-empty');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });

    it('must work \'bem\' preset', function () {
        var htmlDiffer = new HtmlDiffer('bem'),
            files = readFiles('bem-preset');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must work mask {{RegExp}}', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('mask');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.true();
    });

    it('must not be equal by mask {{RegExp}}', function () {
        var htmlDiffer = new HtmlDiffer(),
            files = readFiles('mask-false');

        htmlDiffer.isEqual(files.html1, files.html2).must.be.false();
    });
});
