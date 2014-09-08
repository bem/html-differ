var _ = require('lodash');

require('colors');

/**
 * Recursively sorts the given object by key
 * @param {Object} obj
 * @returns {Object}
 */
function sortObj(obj) {
    var keys = _.keys(obj).sort(),
        sortedObj = {};

    _.forEach(keys, function (key) {
        var objValue = obj[key];

        if (_.isPlainObject(objValue)) {
            objValue = sortObj(objValue);
        }

        sortedObj[key] = objValue;
    });

    return sortedObj;
}

/**
 * Parses the given JSON in HTML attribute
 * @param {String} val
 * @param {Boolean} [isClick]
 * @returns {Object}
 */
function parseAttr(val, isClick) {
    if (isClick) {
        /*jshint evil: true */
        var fn = Function(val);

        return fn ? fn() : {};
    }

    return JSON.parse(val);
}

/**
 * Sorts the given CSS class attribute
 * @param {String} cssClasses
 * @returns {String}
 */
function sortCssClasses(cssClasses) {
    var classList = (cssClasses || '').split(' ');

    return _.filter(classList).sort().join(' ');
}

/**
 * Sets options
 * @param {Object} options
 * @returns {Object}
 */
function defaults(options) {
    if (typeof options === 'string') {
        if (options === 'bem') {
            options = {
                ignoreAttributes: ['id', 'for'],
                compareAttributesAsJSON: ['data-bem', 'onclick', 'ondblclick']
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
        ignoreHtmlComments: true
    });
}

module.exports = {
    sortObj: sortObj,
    parseAttr: parseAttr,
    sortCssClasses: sortCssClasses,
    defaults: defaults
};
