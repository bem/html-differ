var path = require('path'),
    vow = require('vow'),
    vfs = require('vow-fs'),
    HtmlDiffer = require('./html-differ').HtmlDiffer,
    diffLogger = require('./diff-logger');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Compares two html-files\n' +
        'Red text'.red + ' should be removed from the first html relative to the second one, ' +
        'green text'.green + ' should be added')
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
        .title('Path to configuration JSON-file')
        .long('config')
        .end()
    .arg()
        .name('path1')
        .title('Path to the 1-st html-file')
        .req()
        .end()
    .arg()
        .name('path2')
        .title('Path to the 2-nd html-file')
        .req()
        .end()
    .act(function(opts, args) {
        return vow.all([
                vfs.read(path.resolve(args.path1), 'utf-8'),
                vfs.read(path.resolve(args.path2), 'utf-8'),
                opts.config ? vfs.read(path.resolve(opts.config)) : undefined
            ]).spread(function (html1, html2, config) {
                config = config ? JSON.parse(config) : {};

                var diffOpts = { ignoreHtmlAttrs: config.ignoreHtmlAttrs || [], compareHtmlAttrsAsJSON: config.compareHtmlAttrsAsJSON },
                    logOpts = { showCharacters: config.showCharacters || 20 };

                htmlDiffer = new HtmlDiffer(diffOpts),
                diffLogger.log(htmlDiffer.diffHtml(html1, html2), logOpts);
            });
    })
    .run(process.argv.slice(2));
