var compare = require('../lib/html-differ').compare;

describe('compare', function () {
    it('must be equal', function () {
        var html1 = '1234';
        var html2 = '1234';

        compare(html1, html2).must.be.true();
    });

    it('must not be equal', function () {
        var html1 = '124';
        var html2 = '1234';

        compare(html1, html2).must.be.false();
    });
});
