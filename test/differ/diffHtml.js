var HtmlDiffer = require('../../lib/index').HtmlDiffer;

describe('\'diffHtml\'', function () {
    it('must set options', function () {
        var htmlDiffer = new HtmlDiffer({ ignoreAttributes: ['id', 'for'], ignoreWhitespaces: true }),
            first = '<label for="random">label for input</label><input id="random">',
            second = '<label for="sfsdfksdf">label for input</label><input id="sfsdfksdf">',
            res = [ {
                value: '<label for="">label for input</label><input id="">',
                added: undefined,
                removed: undefined
            } ];

        htmlDiffer.diffHtml(first, second).must.be.eql(res);
    });
});
