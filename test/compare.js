var fs = require('fs'),
    compare = require('../lib/html-differ').compare;


describe('\'compare\'', function () {

    it('must be equal', function () {
        var html1 = fs.readFileSync('test/basis/1.html');
        var html2 = fs.readFileSync('test/basis/_1.html');

        compare(html1, html2).must.be.true();
    });

    it('must be equal', function () {
        var html1 = fs.readFileSync('test/basis/2.html');
        var html2 = fs.readFileSync('test/basis/_2.html');

        compare(html1, html2).must.be.true();
    });

    it('must be equal', function () {
        var html1 = fs.readFileSync('test/basis/3.html');
        var html2 = fs.readFileSync('test/basis/_3.html');

        compare(html1, html2).must.be.true();
    });

});
