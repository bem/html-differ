var _ = require('lodash');

/**
 * Recursively sorts the given object by key
 * @param {Object} obj
 * @returns {Object}
 */
exports.sortObj = function sortObj(obj) {
    var keys = _.keys(obj).sort(),
        sortedObj = {};

    _.each(keys, function(key) {
        var objValue = obj[key];

        if(_.isPlainObject(objValue)) {
            objValue = sortObj(objValue);
        }

        sortedObj[key] = objValue;
    });

    return sortedObj;
};

/**
 * Parses the JSON given in HTML attribute
 * @param {String} val
 * @param {Boolean} [isClick]
 * @returns {Object}
 */
exports.parseAttr = function(val, isClick) {
    if (isClick) {
        var fn = Function(val);
        return fn ? fn() : {};
    }

    return JSON.parse(val);
};

/**
 * Sorts the given CSS class attribute
 * @param {String} cssClasses
 * @returns {String}
 */
exports.sortCssClasses = function(cssClasses) {
    var classList = (cssClasses || '').split(' ');

    return _.filter(classList).sort().join(' ');
};

/**
 *
 * @param options
 * @returns {Object}
 */
exports.defaults = function(options) {
    return _.defaults(options || {}, {
        ignoreHtmlAttrs: [],
        compareHtmlAttrsAsJSON: [],

        ignoreWhitespace: true,

        bem: false
    });
};
