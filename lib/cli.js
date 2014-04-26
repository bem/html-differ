var path = require('path'),
    vow = require('vow'),
    vfs = require('vow-fs'),
    compare = require('./html-differ').compare;

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Compares two html-files')
    .opt()
        .name('version')
        .title('Shows the version number')
        .short('v')
        .long('version')
        .flag()
    .end()
    .arg()
        .name('path1')
        .title('Path to the 1-st html-file')
    .end()
    .arg()
        .name('path2')
        .title('Path to the 2-nd html-file')
    .end()
    .act(function(opts, args) {
        if (opts.version) {
            return JSON.parse(require('fs').readFileSync(__dirname + '/../package.json'))
                .version;
        }

        if (!args.path1 || !args.path2) {
            return;
        }

        return vow.all([
                vfs.read(path.resolve(args.path1)),
                vfs.read(path.resolve(args.path2))
            ]).spread(function (html1, html2) {
                return compare(html1, html2, true) ? '' : false;
            });
    })
    .run(process.argv.slice(2));
