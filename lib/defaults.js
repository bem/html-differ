var _ = require('lodash');

var presets = {
    bem: require('../presets/bem.json')
};

/**
 * Sets options
 * @param {Object|String} [options] options or preset name
 * @param {String}   [options.preset]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments=true]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreDuplicateAttributes=false]
 * returns {Object}
 */
 module.exports = function (options) {
    if (typeof options === 'string') {
        options = { preset: options };
    }

    if (options && options.preset) {
        var preset = String(options.preset);
        if (!presets.hasOwnProperty(preset)) {
            throw Error(preset + ' is an invalid preset name.');
        }

        delete options.preset;
        options = _.defaults(options, presets[preset]);
    }

    return _.defaults(options || {}, {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],

        ignoreWhitespaces: true,
        ignoreComments: true,

        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    });
};

module.exports.presets = presets;
