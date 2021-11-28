import path from 'path';
import { fileURLToPath } from 'url';
import * as cli from '../../lib/cli.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
