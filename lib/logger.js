var chalk = require('chalk'),
    inverseGreen = chalk.green.inverse,
    inverseRed = chalk.red.inverse,
    grey = chalk.grey;

/**
 * @typedef {Object} Diff
 * @property {String} value
 * @property {String|undefined} added
 * @property {String|undefined} removed
 */

/**
 * Returns readable diff text
 * @param {Diff[]} diff
 * @param {Object} [options]
 * @param {Number} [options.charsAroundDiff=40]
 * @returns {String}
 */
function getDiffText(diff, options) {
    options = options || {
        charsAroundDiff: 40
    };

    var charsAroundDiff = options.charsAroundDiff,
        output = '';

    if (charsAroundDiff < 0) {
        charsAroundDiff = 40;
    }

    if (diff.length === 1 && !diff[0].added && !diff[0].removed) return output;

    diff.forEach(function (part) {
        var index = diff.indexOf(part),
            partValue = part.value,
            diffColor;

        if (part.added) diffColor = inverseGreen;
        if (part.removed) diffColor = inverseRed;

        if (diffColor) {
            output += (index === 0 ? '\n' : '') + diffColor(partValue);

            return;
        }

        if (partValue.length < charsAroundDiff * 2) {
            output += (index !== 0 ? '' : '\n') + grey(partValue);
        } else {
            index !== 0 && (output += grey(partValue.substr(0, charsAroundDiff)));

            if (index < diff.length - 1) {
                output += '\n...\n' + grey(partValue.substr(partValue.length - charsAroundDiff));
            }
        }
    });

    return output;
}

/**
 * Logs the diff of the given HTML docs to the console
 * @param {Object[]} diff
 * @param {Object} [options]
 * @param {Number} [options.charsAroundDiff=40]
 */
function logDiffText(diff, options) {
    var diffText = getDiffText(diff, options);

    if (diffText) {
        console.log(inverseGreen('+ expected'), inverseRed('- actual'), '\n',  diffText);
    }
}

module.exports = {
    getDiffText: getDiffText,
    logDiffText: logDiffText
};
