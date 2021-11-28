import path from 'path';
import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import coa from 'coa';
import { HtmlDiffer } from './index.js';
import * as diffLogger from './logger.js';
import { defaults, presets } from './defaults.js';

const boldGreen = chalk.green.bold;
const boldRed = chalk.red.bold;
const readAsync = util.promisify(fs.readFile);

export function run(argv) {
  const cmd = coa.Cmd()
    .name(argv[1])
    .title('Compares two HTML')
    .helpful();

  cmd.opt()
    .name('version')
    .title('Shows the version number')
    .short('v').long('version')
    .flag()
    .only()
    .act(function() {
      const p = require('../package.json');
      return p.name + ' ' + p.version;
    });

  cmd.opt()
    .name('config')
    .title('Path to a configuration JSON file')
    .long('config');

  cmd.opt()
    .name('bem')
    .title('Uses predefined options for BEM (deprecated)')
    .long('bem')
    .flag()
    .act(function(opts) {
      console.error('Option ' + boldRed('--bem') + ' is deprecated, use ' + boldGreen('--preset=bem') + ' option instead.');
      // support legacy
      opts.preset = 'bem';
      delete opts.bem;
    });

  cmd.opt()
    .name('preset')
    .title('Name of a preset')
    .short('p').long('preset')
    .val(function(val) {
      if (!presets.hasOwnProperty(val)) {
        console.log(boldRed(val) + ' is an invalid preset name. Available presets are: '
          + Object.keys(presets).map(function(preset) {
            return boldGreen(preset);
          }).join(', ') + '.');
        process.exit(1);
      }
      return val;
    });

  cmd.opt()
    .name('charsAroundDiff')
    .title('The number of characters around the diff (default: 40)')
    .long('chars-around-diff')
    .def(40)
    .val(function(val) {
      return parseInt(val, 10);
    });

  cmd.arg()
    .name('path1')
    .title('Path to the 1-st HTML file')
    .req();

  cmd.arg()
    .name('path2')
    .title('Path to the 2-nd HTML file')
    .req();

  cmd.act(async function(opts, args) {
    const [html1, html2, configFile] = await Promise.all([
      readAsync(path.resolve(args.path1), 'utf8'),
      readAsync(path.resolve(args.path2), 'utf8'),
      opts.config ? readAsync(path.resolve(opts.config), 'utf8') : undefined
    ]);

    const config = configFile ? JSON.parse(configFile) : {};

    if (opts.preset) {
      config.preset = opts.preset;
    }

    const options = defaults(config);
    const htmlDiffer = new HtmlDiffer(options);

    const diff = await htmlDiffer.diffHtml(html1, html2);

    const loggerOptions = {
      charsAroundDiff: opts.charsAroundDiff
    };
    if (!diffLogger.logDiffText(diff, loggerOptions)) {
      process.exit(1);
    }
  }).run(argv.slice(2));

  return cmd;
}
