const fs = require('fs');
const path = require('path');
const fixturesPath = path.join(__dirname, 'fixtures');
const HtmlDiffer = require('../../lib/index').HtmlDiffer;

/**
 * @param {String} basename
 * @returns {Object}
 */
function readFiles(basename) {
  const fileName = basename + '.html';

  return {
    html1: fs.readFileSync(path.join(fixturesPath, 'first', fileName), 'utf-8'),
    html2: fs.readFileSync(path.join(fixturesPath, 'second', fileName), 'utf-8')
  };
}

describe('\'isEqual\'', function() {
  it('must be equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('equal');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must be not equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('not-equal');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.false();
  });

  it('must consider uppercase and lowercase declarations in \'doctype\' to be equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('doctype');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must sort attributes', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('sort-attributes');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must sort classes\' values', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('sort-classes');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must sort values of attributes as JSON when the content is not a function', async function() {
    const htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['a', { name: 'b', isFunction: false }] });
    const files = readFiles('sort-values-in-json-format');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must handle invalid JSON', async function() {
    const htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['data-bem'] });
    const files = readFiles('invalid-json');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must sort values of attributes as JSON when the content is a function', async function() {
    const options = {
      compareAttributesAsJSON: [
        { name: 'onclick', isFunction: true },
        { name: 'ondblclick', isFunction: true }
      ]
    };
    const htmlDiffer = new HtmlDiffer(options);
    const files = readFiles('sort-functions-in-json-format');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must handle invalid function', async function() {
    const options = { compareAttributesAsJSON: [{ name: 'onclick', isFunction: true }] };
    const htmlDiffer = new HtmlDiffer(options);
    const files = readFiles('invalid-function');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work option \'ignoreAttributes\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'] });
    const files = readFiles('ignore-attributes');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work option \'ignoreWhitespaces\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreWhitespaces: true });
    const files = readFiles('ignore-whitespaces');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work option \'ignoreComments\'', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('ignore-comments');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must does NOT work option \'ignoreComments\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreComments: false });
    const files = readFiles('ignore-comments-false');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work option \'ignoreEndTags\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreEndTags: true });
    const files = readFiles('ignore-end-tags');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work \'bem\' preset', async function() {
    const htmlDiffer = new HtmlDiffer('bem');
    const files = readFiles('bem-preset');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must work mask {{RegExp}}', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('mask');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must not be equal by mask {{RegExp}}', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = readFiles('mask-false');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.false();
  });

  it('must ignore self closing slash', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreSelfClosingSlash: true });
    const files = readFiles('strip-self-closing-slash');

    (await htmlDiffer.isEqual(files.html1, files.html2)).must.be.true();
  });

  it('must throw an error for invalid preset', function() {
    function invalidPreset() {
      return new HtmlDiffer({ preset: 'invalid' });
    }

    invalidPreset.must.throw(Error);
  });
});
