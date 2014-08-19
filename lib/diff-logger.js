require('colors');

/**
 * Returns readable diff text
 * @param {Object[]} diff
 * @param {Object} [options]
 * @param {Number} [options.charsAroundDiff=40]
 * @returns {String}
 */
function getDiffText(diff, options) {
    options = options || {
        charsAroundDiff: 40
    };

    if (options.showCharacters) {
        console.log('WARNING! Option \'showCharacters\' is deprecated, please, use \'charsAroundDiff\''.red);
        options.charsAroundDiff = options.showCharacters;
    }

    var charsAroundDiff = options.charsAroundDiff,
        output = '';

    if (charsAroundDiff < 0) {
        charsAroundDiff = 40;
    }

    if (diff.length === 1 && !diff[0].added && !diff[0].removed) { return output; }

    diff.forEach(function (part) {
        var index = diff.indexOf(part),
            partValue = part.value,
            color = 'grey';

        if (part.added) { color = 'green'; }
        if (part.removed) { color = 'red'; }

        if (color !== 'grey') {
            output += (!index ? '\n' : '') + partValue.inverse[color];

            return;
        }

        if (partValue.length < charsAroundDiff * 2) {
            output += (index ? '' : '\n') + partValue.grey;
        } else {
            index && (output += partValue.substr(0, charsAroundDiff).grey);

            if (index < diff.length - 1) {
                output += '\n...\n' + partValue.substr(partValue.length - charsAroundDiff, charsAroundDiff).grey;
            }
        }
    });

    return output;
}

/**
 * Logs diff of the given HTML docs to the console
 * @param {Object[]} diff
 * @param {Object} [options]
 * @param {Number} [options.charsAroundDiff=40]
 */
function log(diff, options) {
    var diffText = getDiffText(diff, options);

    if (diffText) {
        console.log('+ expected'.inverse.green, '- actual'.inverse.red, '\n',  diffText);
    }
}

module.exports = {
    getDiffText: getDiffText,
    log: log
};
