var _ = require('lodash');

/**
 * Sets options
 * @param {Object} [options]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean} [options.ignoreWhitespaces=true]
 * @param {Boolean} [options.ignoreComments=true]
 * @param {Boolean} [options.ignoreClosingTags=false]
 * @param {Boolean} [options.ignoreDuplicateAttributes=false]
 * returns {Object}
 */
 module.exports = function (options) {
    if (typeof options === 'string') {
        if (options === 'bem') {
            options = {
                // ignore generated attributes
                ignoreAttributes: ['id', 'for', 'aria-labelledby', 'aria-describedby'],
                compareAttributesAsJSON: [
                    'data-bem',
                    { name: 'onclick', isFunction: true },
                    { name: 'ondblclick', isFunction: true }
                ],
                ignoreComments: false
            };
        } else {
            console.error(options.bold.red + ' is an invalid preset name. Use ' + 'bem'.bold.green + ' instead.');
            process.exit(1);
        }
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
