var utils = require('../../lib/utils/utils');

describe('\'utils\'', function () {
    it('must sort attributes in alphabetical order', function () {
        var input = [
                { name: 'c', value: 'c' },
                { name: 'z', value: 'a' },
                { name: 'b', value: 'b' },
                { name: 'b', value: 'a' },
                { name: 'b', value: 'c' },
                { name: 'a', value: 'z' },
                { name: 'z', value: 'a' }
            ],
            output = [
                { name: 'a', value: 'z' },
                { name: 'b', value: 'a' },
                { name: 'b', value: 'b' },
                { name: 'b', value: 'c' },
                { name: 'c', value: 'c' },
                { name: 'z', value: 'a' },
                { name: 'z', value: 'a' }
            ];

        utils.sortAttrs(input).must.be.eql(output);
    });

    it('must sort CSS classes\' values', function () {
        var input = [
                { name: 'class', value: ' b c a' },
                { name: 'blah', value: 'b c a' },
                { name: 'class', value: '' },
                { name: 'class', value: 'a a a' }
            ],
            output = [
                { name: 'class', value: 'a b c' },
                { name: 'blah', value: 'b c a' },
                { name: 'class', value: '' },
                { name: 'class', value: 'a' }
            ];

        utils.sortCssClasses(input).must.be.eql(output);
    });

    it('must sort attributes\' values which are in JSON format', function () {
        var options = [
                'a',
                { name: 'onclick', isFunction: true },
                { name: 'ondblclick', isFunction: true }
            ],
            input = [
                { name: 'a', value: '{"b":{"b":"b","a":"a"},"a":"a"}' },
                { name: 'a', value: '{"a":"b","b":"a"}' },
                { name: 'onclick', value: 'return {"b":{"b":"b","a":"a"},"a":"a"}' },
                { name: 'ondblclick', value: 'return {"b":{"b":"b","a":"a"},"a":"a"}' },
                { name: 'c', value: '{"c":"c"}' }
            ],
            output = [
                { name: 'a', value: '{"a":"a","b":{"a":"a","b":"b"}}' },
                { name: 'a', value: '{"a":"b","b":"a"}' },
                { name: 'onclick', value: 'return {"a":"a","b":{"a":"a","b":"b"}}' },
                { name: 'ondblclick', value: 'return {"a":"a","b":{"a":"a","b":"b"}}' },
                { name: 'c', value: '{"c":"c"}' }
            ];

        utils.sortAttrsValues(input, options).must.be.eql(output);
    });

    it('must remove attributes\' values', function () {
        var input = [
                { name: 'a', value: 'a' },
                { name: 'a', value: 'a' },
                { name: 'b', value: 'b' },
                { name: 'c', value: 'c' }
            ],
            output = [
                { name: 'a', value: '' },
                { name: 'a', value: '' },
                { name: 'b', value: '' },
                { name: 'c', value: 'c' }
            ];

        utils.removeAttrsValues(input, ['a', 'b']).must.be.eql(output);
    });

    it('must remove whitespaces', function () {
        var input = '    \n\n  \f   \t  text  \v     \v  text  \n  \r text\r\t\t    \t   \n\n\t   ',
            output = 'text text text';

        utils.removeWhitespaces(input).must.be.eql(output);
    });

    it('must remove duplicate attributes', function () {
        var input = [
                { name: 'a', value: 'a' },
                { name: 'a', value: 'b' },
                { name: 'b', value: 'a' }
            ],
            output = [
                { name: 'a', value: 'a' },
                { name: 'b', value: 'a' }
            ];

        utils.removeDuplicateAttributes(input).must.be.eql(output);
    });
});
