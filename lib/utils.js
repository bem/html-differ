var _ = require('lodash');

require('colors');

/**
 * Gets the attribute's indexes in the array of the attributes
 * @param {Array} attrs
 * @param {String} attr
 * @returns {Array}
 */
function _getIndexesInArray(attrs, attr) {
    var res = [];

    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].name === attr) { res.push(i); }
    }

    return res;
}

/**
 * Sorts the attributes in alphabetical order
 * @param {Array} attrs
 * @returns {Array}
 */
function sortAttrs(attrs) {
    return attrs.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        }

        return 0;
    });
}

/**
 * Removes duplicate attributes from the given list
 * @param {Array} attrs
 * @returns {Array}
 */
function ignoreDuplicateAttributes(attrs) {
    var attrsNames = [],
        res = [];

    _.forEach(attrs, function (attr) {
        if (attrsNames.indexOf(attr.name) === -1) {
            res.push(attr);
            attrsNames.push(attr.name);
        }
    });

    return res;
}

/**
 * Sorts values of the attribute 'class'
 * @param {Array} attrs
 * @returns {Array}
 */
function sortCssClasses(attrs) {
    /**
     * Sorts the given CSS class attribute
     * @param {String} cssClasses
     * @returns {String}
     */
    function _sortCssClassesValues(cssClasses) {
        var classList = (cssClasses || '').split(' ');

        return _.filter(classList).sort().join(' ');
    }

    var classIndexes = _getIndexesInArray(attrs, 'class');

    _.forEach(classIndexes, function (index) {
        attrs[index].value = _sortCssClassesValues(attrs[index].value);
    });

    return attrs;
}

/**
 * Sorts values of attributes which have JSON format
 * @param {Array} attrs
 * @param {Array} compareAttributesAsJSON
 * return {Array}
 */
function sortAttrsValues(attrs, compareAttributesAsJSON) {
    /**
     * Recursively sorts the given object by key
     * @param {Object} obj
     * @returns {Object}
     */
    function _sortObj(obj) {
        var keys = _.keys(obj).sort(),
            sortedObj = {};

        _.forEach(keys, function (key) {
            var objValue = obj[key];

            if (_.isPlainObject(objValue)) {
                objValue = _sortObj(objValue);
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
    function _parseAttr(val, isClick) {
        if (isClick) {
            /*jshint evil: true */
            var fn = Function(val);

            return fn ? fn() : {};
        }

        return JSON.parse(val);
    }

    _.forEach(compareAttributesAsJSON, function (attr) {
        var attrValue,
            isFunction = (attr === 'onclick' || attr === 'ondblclick'), // @FIXME: should be configurable
            attrIndexes = _getIndexesInArray(attrs, attr);

        _.forEach(attrIndexes, function (index) {
            attrValue = _parseAttr(attrs[index].value, isFunction);
            attrValue = _sortObj(attrValue);
            attrValue = JSON.stringify(attrValue);

            attrs[index].value = (isFunction ? 'return ' : '') + attrValue;
        });
    });

    return attrs;
}

/**
 * Replaces the values of attributes on an empty string
 * @param {Array} attrs
 * @param {Array} ignoreAttributes
 * @returns {Array}
 */
function ignoreAttrsValues(attrs, ignoreAttributes) {
    _.forEach(ignoreAttributes, function (attr) {
        var attrIndexes = _getIndexesInArray(attrs, attr);

        _.forEach(attrIndexes, function (index) {
            attrs[index].value = '';
        });
    });

    return attrs;
}

/**
 * Removes whitespaces from the text
 * @param {String} text
 * @returns {String}
 */
function ignoreWhitespaces(text) {
    return text
        .replace(/(\n|\r|\t|\v|\f)+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

module.exports = {
    sortAttrs: sortAttrs,
    sortCssClasses: sortCssClasses,

    sortAttrsValues: sortAttrsValues,
    ignoreAttrsValues: ignoreAttrsValues,
    ignoreWhitespaces: ignoreWhitespaces,

    ignoreDuplicateAttributes: ignoreDuplicateAttributes
};
