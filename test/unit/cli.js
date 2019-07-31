const path = require('path');
const cli = require('../../lib/cli');

function run(...args) {
  return function() {
    return cli.run([
      'node',
      'html-differ',
      ...args
    ]);
  };
}

const file1 = path.resolve(__dirname, './fixtures/cli.html');

describe('\'cli\'', function() {
  it('must run', function() {
    run(file1, file1).must.not.throw();
  });
});
