var fs = require('fs'),
    diffHtml = require('../lib/html-differ').diffHtml;

function test(f1, f2) {
    var html1 = fs.readFileSync('test/basis/' + f1),
        html2 = fs.readFileSync('test/basis/' + f2);

    return diffHtml(html1, html2);
}


describe('\'diffHtml\'', function () {

    it('must be equal', function () {
        test('1.html', '_1.html').must.be.true();
    });

    it('must be equal', function () {
        test('2.html', '_2.html').must.be.true();
    });

    it('must be equal', function () {
        test('3.html', '_3.html').must.be.true();
    });

    it('must be equal', function () {
        test('4.html', '_4.html').must.be.true();
    });

});
