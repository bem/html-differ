import chalk from 'chalk';
import * as diffLoger from '../../lib/logger.js';

const inverseGreen = chalk.green.inverse;
const inverseRed = chalk.red.inverse;
const grey = chalk.grey;

describe('\'getDiffText\'', function() {
  it('must return an empty string', function() {
    const inp = [{
      value: 'text',
      added: undefined,
      removed: undefined
    }];

    diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.equal('');
  });

  it('must return a diff string', function() {
    const inp = [{
        value: 'texttexttexttexttexttexttexttexttexttexttext',
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
        value: 'texttexttexttext',
        added: undefined,
        removed: undefined
      }],
      out = '\n...\n' + grey('texttexttexttexttext') + inverseGreen('!') + grey('Text') + inverseGreen('!')
                + grey('texttexttexttext');

    diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
  });

  it('must consider negative value of \'charsAroundDiff\' option', function() {
    const inp = [{
      value: 'text',
      added: undefined,
      removed: undefined
    }];

    diffLoger.getDiffText(inp, { charsAroundDiff: -5 }).must.be.equal('');
  });

  it('must return a diff when there is nothing else in the input', function() {
    const inp = [{
        value: 'texttexttexttexttexttexttexttexttexttexttext',
        added: true,
        removed: undefined
      }, {
        value: 'ololoololoololoololoololoololoololoololoolol',
        added: false,
        removed: true
      }],
      out = '\n' + inverseGreen('texttexttexttexttexttexttexttexttexttexttext')
                + inverseRed('ololoololoololoololoololoololoololoololoolol');

    diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
  });

  it('must return a diff on the beginning of the input', function() {
    const inp = [{
        value: 'texttexttext',
        added: undefined,
        removed: undefined
      }, {
        value: 'text',
        added: undefined,
        removed: true
      }, {
        value: 'texttexttexttext',
        added: undefined,
        removed: undefined
      }],
      out = '\n' + grey('texttexttext') + inverseRed('text') + grey('texttexttexttext');

    diffLoger.getDiffText(inp).must.be.eql(out);
  });

  it('must return several diffs', function() {
    const inp = [{
        value: 'texttexttexttexttexttexttexttexttexttexttext',
        added: undefined,
        removed: undefined
      }, {
        value: 'text',
        added: undefined,
        removed: true
      }, {
        value: 'texttexttexttexttexttexttexttexttexttexttext',
        added: undefined,
        removed: undefined
      }, {
        value: '!',
        added: true,
        removed: false
      }, {
        value: 'text',
        added: undefined,
        removed: undefined
      }, {
        value: '!',
        added: true,
        removed: false
      }, {
        value: 'texttexttexttexttexttexttexttexttexttext',
        added: undefined,
        removed: undefined
      }],
      out = '\n...\n' + grey('texttexttexttexttext') + inverseRed('text')
                + grey('texttexttexttexttext') + '\n...\n' + grey('texttexttexttexttext')
                    + inverseGreen('!') + grey('text') + inverseGreen('!') + grey('texttexttexttexttext');

    diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
  });
});
