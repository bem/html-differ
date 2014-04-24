var fs = require('fs'),
    print = require('util').print,
    html = require('./html-differ');

var args = process.argv.slice(2),
    opts = args.length ? getOpts(args, [
            '-v', '--version',
            '-h', '--help',
            ]) : null,
    single = opts && opts.single,
    other = opts && opts.other,
    first_path = other && other[0],
    second_path = other && other[1];

if (single && single.contains(['-v', '--version'])) {
    print(require('../package.json').version + '\n');
} else if (!second_path || !opts || (single && single.contains(['-h', '--help'])) || other.length > 2) {
    printFile('USAGE');
} else {

    var first_html = fs.readFileSync(first_path, 'utf-8'),
        second_html = fs.readFileSync(second_path, 'utf-8');

    html.compare(first_html, second_html);
}

// Utils

function getOpts(argv, o_single) {
    var opts = { single : [], other : [] },
        arg,
        i = 0;

    for (; i < argv.length; i++) {
        arg = argv[i];
        if (o_single && o_single.indexOf(arg) !== -1) {
            opts.single.push(arg);
        } else opts.other.push(arg);
    }

    opts.single.contains = function(value) {
        if (typeof value === 'string') {
            return this.indexOf(value) !== -1;
        } else {
            for (var i = 0; i < value.length; i++) if (this.indexOf(value[i]) !== -1) return true;
        }
        return false;
    };

    return opts;
}

function printFile(filename) {
    print(fs.readFileSync(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/' + filename, 'utf-8'));
}
