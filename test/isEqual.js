var fs = require('fs'),
    htmlDiffer = require('../lib/html-differ');

function test(f1, f2) {
    var html1 = fs.readFileSync('test/basis/' + f1, 'utf-8'),
        html2 = fs.readFileSync('test/basis/' + f2, 'utf-8');

    return htmlDiffer.isEqual(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } );
}


describe('\'isEqual\'', function () {

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
