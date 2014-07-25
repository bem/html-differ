var path = require('path'),
    vow = require('vow'),
    vfs = require('vow-fs'),
    HtmlDiffer = require('./index').HtmlDiffer,
    diffLogger = require('./diff-logger'),
    utils = require('./utils');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Compares two HTML codes')
    .opt()
        .name('version')
        .title('Shows the version number')
        .short('v').long('version')
        .flag()
        .only()
        .act(function() {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('config')
        .title('Path to configuration JSON file')
        .long('config')
        .end()
    .opt()
        .name('charsAroundDiff')
        .title('The number of characters around the diff (default: 40)')
        .long('chars-around-diff')
        .def(40)
        .val(function(val) {
            return parseInt(val);
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
    .act(function(opts, args) {
        return vow.all([
                vfs.read(path.resolve(args.path1), 'utf-8'),
                vfs.read(path.resolve(args.path2), 'utf-8'),
                opts.config ? vfs.read(path.resolve(opts.config)) : undefined
            ]).spread(function (html1, html2, config) {
                config = config ? JSON.parse(config) : {};

                var options = utils.defaults(config),
                    loggerOptions = {
                        charsAroundDiff: opts.charsAroundDiff
                    },
                    htmlDiffer = new HtmlDiffer(options);

                diffLogger.log(htmlDiffer.diffHtml(html1, html2), loggerOptions);
            });
    })
    .run(process.argv.slice(2));
