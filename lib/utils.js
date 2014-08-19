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
    if (options && options.hasOwnProperty('ignoreWhitespace')) {
        console.log('WARNING! Option \'ignoreWhitespace\' is deprecated, please, use \'ignoreWhitespaces\''.bold.red);
        options.ignoreWhitespaces = options.ignoreWhitespace;

        delete options.ignoreWhitespace;
    }

    return _.defaults(options || {}, {
        ignoreHtmlAttrs: [],
        compareHtmlAttrsAsJSON: [],

        ignoreWhitespaces: true,
        ignoreHtmlComments: true,

        bem: false
    });
}

module.exports = {
    sortObj: sortObj,
    parseAttr: parseAttr,
    sortCssClasses: sortCssClasses,
    defaults: defaults
};
