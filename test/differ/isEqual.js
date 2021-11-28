import fs from 'fs';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { HtmlDiffer } from '../../lib/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readAsync = util.promisify(fs.readFile);
const fixturesPath = path.join(__dirname, 'fixtures');

/**
 * @param {String} basename
 * @returns {Object}
 */
function readFiles(basename) {
  const fileName = basename + '.html';
  return Promise.all([
    readAsync(path.join(fixturesPath, 'first', fileName), 'utf-8'),
    readAsync(path.join(fixturesPath, 'second', fileName), 'utf-8')
  ]);
}

describe('\'isEqual\'', function() {
  it('must be equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('equal');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must be not equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('not-equal');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.false();
  });

  it('must consider uppercase and lowercase declarations in \'doctype\' to be equal', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('doctype');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must sort attributes', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('sort-attributes');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must sort classes\' values', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('sort-classes');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must sort values of attributes as JSON when the content is not a function', async function() {
    const htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['a', { name: 'b', isFunction: false }] });
    const files = await readFiles('sort-values-in-json-format');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must handle invalid JSON', async function() {
    const htmlDiffer = new HtmlDiffer({ compareAttributesAsJSON: ['data-bem'] });
    const files = await readFiles('invalid-json');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must sort values of attributes as JSON when the content is a function', async function() {
    const options = {
      compareAttributesAsJSON: [
        { name: 'onclick', isFunction: true },
        { name: 'ondblclick', isFunction: true }
      ]
    };
    const htmlDiffer = new HtmlDiffer(options);
    const files = await readFiles('sort-functions-in-json-format');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must handle invalid function', async function() {
    const options = { compareAttributesAsJSON: [{ name: 'onclick', isFunction: true }] };
    const htmlDiffer = new HtmlDiffer(options);
    const files = await readFiles('invalid-function');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work option \'ignoreAttributes\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'] });
    const files = await readFiles('ignore-attributes');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work option \'ignoreWhitespaces\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreWhitespaces: true });
    const files = await readFiles('ignore-whitespaces');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work option \'ignoreComments\'', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('ignore-comments');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must does NOT work option \'ignoreComments\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreComments: false });
    const files = await readFiles('ignore-comments-false');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work option \'ignoreEndTags\'', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreEndTags: true });
    const files = await readFiles('ignore-end-tags');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work \'bem\' preset', async function() {
    const htmlDiffer = new HtmlDiffer('bem');
    const files = await readFiles('bem-preset');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must work mask {{RegExp}}', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('mask');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must not be equal by mask {{RegExp}}', async function() {
    const htmlDiffer = new HtmlDiffer();
    const files = await readFiles('mask-false');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.false();
  });

  it('must ignore self closing slash', async function() {
    const htmlDiffer = new HtmlDiffer({ ignoreSelfClosingSlash: true });
    const files = await readFiles('strip-self-closing-slash');
    const isEqual = await htmlDiffer.isEqual(...files);

    isEqual.must.be.true();
  });

  it('must throw an error for invalid preset', function() {
    function invalidPreset() {
      return new HtmlDiffer({ preset: 'invalid' });
    }

    invalidPreset.must.throw(Error);
  });
});
