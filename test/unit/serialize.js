import * as serialize from '../../lib/utils/serialize.js';

describe('\'serialize\'', function() {
  it('must serialize empty doctype', function() {
    const output = '<!DOCTYPE>';

    serialize.doctype('', null, null).must.be.equal(output);
  });

  it('must serialize doctype without \'publicId\' and \'systemId\'', function() {
    const output = '<!DOCTYPE HTML>';

    serialize.doctype('HTML', null, null).must.be.equal(output);
  });

  it('must serialize doctype with \'publicId\' and \'systemId\'', function() {
    const output = '<!DOCTYPE HTML PUBLIC "_PUBLIC" "_SYSTEM">';

    serialize.doctype('html', '_PUBLIC', '_SYSTEM').must.be.equal(output);
  });

  it('must serialize doctype with \'publicId\'', function() {
    const output = '<!DOCTYPE HTML PUBLIC "_PUBLIC">';

    serialize.doctype('html', '_PUBLIC', null).must.be.equal(output);
  });

  it('must serialize doctype with \'systemId\'', function() {
    const output = '<!DOCTYPE HTML SYSTEM "_SYSTEM">';

    serialize.doctype('html', null, '_SYSTEM').must.be.equal(output);
  });

  it('must serialize start tag without attributes', function() {
    const output = '<blah>';

    serialize.startTag('blah', [], false).must.be.equal(output);
  });

  it('must serialize start tag with attributes', function() {
    const attrs = [
        { name: 'id', value: '1' },
        { name: 'id', value: '2' },
        { name: 'class', value: ' a b c' }
      ],
      output = '<blah id="1" id="2" class=" a b c">';

    serialize.startTag('blah', attrs, false).must.be.equal(output);
  });

  it('must serialize self closing start tag', function() {
    const output = '<blah/>';

    serialize.startTag('blah', [], true).must.be.equal(output);
  });

  it('must serialize end tag', function() {
    const output = '</blah>';

    serialize.endTag('blah').must.be.equal(output);
  });

  it('must serialize text', function() {
    const output = '\nblah\t&quot;';

    serialize.text('\nblah\t"').must.be.equal(output);
  });

  it('must serialize comments', function() {
    const output = '<!-- blah -->';

    serialize.comment(' blah ').must.be.equal(output);
  });
});
