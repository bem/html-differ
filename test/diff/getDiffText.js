var diffLoger = require('../../lib/logger');

require('colors');

describe('\'getDiffText\'', function () {
    it('must return an empty string', function () {
        var inp = [ {
                value: 'text',
                added: undefined,
                removed: undefined
            } ];

        diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.equal('');
    });

    it('must return a diff string', function () {
        var inp = [ {
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
            } ],
            out = '\n...\n' + 'texttexttexttexttext'.grey + '!'.inverse.green + 'Text'.grey + '!'.inverse.green +
                'texttexttexttext'.grey;

        diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
    });

    it('must consider negative value of \'charsAroundDiff\' option', function () {
        var inp = [ {
                value: 'text',
                added: undefined,
                removed: undefined
            } ];

        diffLoger.getDiffText(inp, { charsAroundDiff: -5 }).must.be.equal('');
    });

    it('must return a diff when there is nothing else in the input', function () {
        var inp = [ {
                value: 'texttexttexttexttexttexttexttexttexttexttext',
                added: true,
                removed: undefined
            }, {
                value: 'ololoololoololoololoololoololoololoololoolol',
                added: false,
                removed: true
            } ],
            out = '\n' + 'texttexttexttexttexttexttexttexttexttexttext'.inverse.green +
                'ololoololoololoololoololoololoololoololoolol'.inverse.red;

        diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
    });

    it('must return a diff on the beginning of the input', function () {
        var inp = [ {
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
            } ],
            out = '\n' + 'texttexttext'.grey + 'text'.inverse.red + 'texttexttexttext'.grey;

        diffLoger.getDiffText(inp).must.be.eql(out);
    });

    it('must return several diffs', function () {
        var inp = [ {
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
                value: 'texttexttexttexttext',
                added: undefined,
                removed: undefined
            } ],
            out = '\n...\n' + 'texttexttexttexttext'.grey + 'text'.inverse.red +
                'texttexttexttexttext'.grey + '\n...\n' + 'texttexttexttexttext'.grey +
                    '!'.inverse.green + 'text'.grey + '!'.inverse.green + 'texttexttexttexttext'.grey;

        diffLoger.getDiffText(inp, { charsAroundDiff: 20 }).must.be.eql(out);
    });
});
