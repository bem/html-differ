var path = require('path'),
    vow = require('vow'),
    vfs = require('vow-fs'),
    compare = require('./html-differ').compare;

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Compares two html files')
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
                vfs.read(path.resolve(args.path1)),
                vfs.read(path.resolve(args.path2))
            ]).spread(function (html1, html2) {
                return compare(html1, html2, true) ? '' : false;
            });
    })
    .run(process.argv.slice(2));
