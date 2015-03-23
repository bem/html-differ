var path = require('path'),
    vow = require('vow'),
    vfs = require('vow-fs'),
    chalk = require('chalk'),
    boldGreen = chalk.green.bold,
    boldRed = chalk.red.bold,
    HtmlDiffer = require('./index').HtmlDiffer,
    diffLogger = require('./logger'),
    defaults = require('./defaults');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Compares two HTML')
    .opt()
        .name('version')
        .title('Shows the version number')
        /*jshint -W024 */
        .short('v').long('version')
        .flag()
        .only()
        .act(function () {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('config')
        .title('Path to a configuration JSON file')
        .long('config')
        .end()
    .opt()
        .name('bem')
        .title('Uses predefined options for BEM (deprecated)')
        .long('bem')
        .flag()
        .act(function (opts) {
            console.error('Option ' +  boldRed('--bem') + ' is deprecated, use ' +
                boldGreen('--preset=bem') + ' option instead.');
            // support legacy
            opts.preset = 'bem';
            delete opts.bem;
        })
        .end()
    .opt()
        .name('preset')
        .title('Name of a preset')
        .short('p').long('preset')
        .val(function (val) {
            if (!defaults.presets.hasOwnProperty(val)) {
                console.log(boldRed(val) + ' is an invalid preset name. Available presets are: ' +
                    Object.keys(defaults.presets).map(function (preset) {
                        return boldGreen(preset);
                    }).join(', ') + '.');
                process.exit(1);
            }
            return val;
        })
        .end()
    .opt()
        .name('charsAroundDiff')
        .title('The number of characters around the diff (default: 40)')
        .long('chars-around-diff')
        .def(40)
        .val(function (val) {
            return parseInt(val, 10);
        })
        .end()
    .arg()
        .name('path1')
        .title('Path to the 1-st HTML file')
        .req()
        .end()
    .arg()
        .name('path2')
        .title('Path to the 2-nd HTML file')
        .req()
        .end()
    .act(function (opts, args) {
        return vow.all([
            vfs.read(path.resolve(args.path1), 'utf-8'),
            vfs.read(path.resolve(args.path2), 'utf-8'),
            opts.config ? vfs.read(path.resolve(opts.config)) : undefined
        ]).spread(function (html1, html2, config) {
            config = config ? JSON.parse(config) : {};

            if (opts.preset) {
                config.preset = opts.preset;
            }

            var options = defaults(config),
                loggerOptions = {
                    charsAroundDiff: opts.charsAroundDiff
                },
                htmlDiffer = new HtmlDiffer(options);

            diffLogger.logDiffText(htmlDiffer.diffHtml(html1, html2), loggerOptions);
        });
    })
    .run(process.argv.slice(2));
