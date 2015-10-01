var serialize = require('../../lib/utils/serialize');

describe('\'serialize\'', function () {
    it('must serialize empty doctype', function () {
        var output = '<!DOCTYPE>';

        serialize.doctype('', null, null).must.be.equal(output);
    });

    it('must serialize doctype without \'publicId\' and \'systemId\'', function () {
        var output = '<!DOCTYPE HTML>';

        serialize.doctype('HTML', null, null).must.be.equal(output);
    });

    it('must serialize doctype with \'publicId\' and \'systemId\'', function () {
        var output = '<!DOCTYPE HTML PUBLIC "_PUBLIC" "_SYSTEM">';

        serialize.doctype('html', '_PUBLIC', '_SYSTEM').must.be.equal(output);
    });

    it('must serialize doctype with \'publicId\'', function () {
        var output = '<!DOCTYPE HTML PUBLIC "_PUBLIC">';

        serialize.doctype('html', '_PUBLIC', null).must.be.equal(output);
    });

    it('must serialize doctype with \'systemId\'', function () {
        var output = '<!DOCTYPE HTML SYSTEM "_SYSTEM">';

        serialize.doctype('html', null, '_SYSTEM').must.be.equal(output);
    });

    it('must serialize start tag without attributes', function () {
        var output = '<blah>';

        serialize.startTag('blah', [], false).must.be.equal(output);
    });

    it('must serialize start tag with attributes', function () {
        var attrs = [
                { name: 'id', value: '1' },
                { name: 'id', value: '2' },
                { name: 'class', value: ' a b c' }
            ],
            output = '<blah id="1" id="2" class=" a b c">';

        serialize.startTag('blah', attrs, false).must.be.equal(output);
    });

    it('must serialize self closing start tag', function () {
        var output = '<blah/>';

        serialize.startTag('blah', [], true).must.be.equal(output);
    });

    it('must serialize end tag', function () {
        var output = '</blah>';

        serialize.endTag('blah').must.be.equal(output);
    });

    it('must serialize text', function () {
        var output = '\nblah\t&quot;';

        serialize.text('\nblah\t"').must.be.equal(output);
    });

    it('must serialize comments', function () {
        var output = '<!-- blah -->';

        serialize.comment(' blah ').must.be.equal(output);
    });
});
