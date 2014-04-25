var path = require('path');
var vow = require('vow');
var vfs = require('vow-fs');
var compare = require('./html-differ').compare;

module.exports = require('coa').Cmd() // main (top level) command declaration
    .name(process.argv[1]) // set top level command name from program name
    .title('My awesome command line util') // title for use in text messages
    .helpful() // make command "helpful", i.e. options -h --help with usage message
    .opt() // add some option
    .name('version') // name for use in API
    .title('Version') // title for use in text messages
    .short('v') // short key: -v
    .long('version') // long key: --version
    .flag() // for options without value
    .end() // end
    .arg()
    .name('file1')
    .title('File 1')
    .end()
    .arg()
    .name('file2')
    .title('File 2')
    .end()
    .act(function(opts, args) { // add action for option
        if (opts.version) {
            return JSON.parse(require('fs').readFileSync(__dirname + '/../package.json'))
                .version;
        }

        if (!args.file1 || !args.file2) {
            return;
        }

        return vow.all([
                vfs.read(path.resolve(args.file1)),
                vfs.read(path.resolve(args.file2))
            ]).spread(function (html1, html2) {
                return compare(html1, html2);
            });
    })
    .run(process.argv.slice(2));
