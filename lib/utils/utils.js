var _ = require('lodash');

/**
 * Gets the attribute's indexes in the array of the attributes
 * @param {Array} attrs
 * @param {String} attr
 * @returns {Array}
 */
function _getIndexesInArray(attrs, attr) {
    var res = [];

    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].name === attr) res.push(i);
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
        } else if (a.value < b.value) {
            return -1;
        } else if (a.value > b.value) {
            return 1;
        }

        return 0;
    });
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

        return _(classList)
            .filter()
            .uniq()
            .sort()
            .join(' ');
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
        if (!_.isObject(obj)) {
            return JSON.stringify(obj);
        }

        if (_.isArray(obj)) {
            return '[' + _(obj).map(_sortObj).join(',') + ']';
        }

        return '{' +
            _(obj)
                .keys()
                .sort()
                .map(function (key) {
                    return JSON.stringify(key) + ':' + _sortObj(obj[key]);
                })
                .join(',') +
            '}';
    }

    /**
     * Parses the given in HTML attribute JSON
     * @param {String} val
     * @param {Boolean} [isClick]
     * @returns {Object}
     */
    function _parseAttr(val, isClick) {
        try {
            if (isClick) {
                /*jshint evil: true */
                var fn = Function(val);

                return fn ? fn() : {};
            }

            return JSON.parse(val);
        } catch (err) {
            return undefined;
        }
    }

    _.forEach(compareAttributesAsJSON, function (attr) {
        if (typeof attr === 'string') {
            var name = attr;
            attr = {};
            attr.name = name;
            attr.isFunction = false;
        }

        var attrValue,
            isFunction = (attr.isFunction),
            attrIndexes = _getIndexesInArray(attrs, attr.name);

        _.forEach(attrIndexes, function (index) {
            attrValue = _parseAttr(attrs[index].value, isFunction);

            attrValue = _sortObj(attrValue);

            attrs[index].value = (isFunction && attrValue ? 'return ' : '') + attrValue;
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
function removeAttrsValues(attrs, ignoreAttributes) {
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
function removeWhitespaces(text) {
    return text
        .replace(/(\n|\r|\t|\v|\f)+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Removes duplicate attributes from the given list
 * @param {Array} attrs
 * @returns {Array}
 */
function removeDuplicateAttributes(attrs) {
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
 * Processes a conditional comment
 * @param {String} comment
 * @param {Function} modify
 * @param {Object} options
 * @returns {String|undefined}
 */
function getConditionalComment(comment, modify, options) {
    var START_IF = '^\\s*\\[if .*\\]>',
        END_IF = '<!\\[endif\\]\\s*$',
        matchedStartIF = comment.match(new RegExp(START_IF)),
        matchedEndIF = comment.match(new RegExp(END_IF));

    if (comment.match(new RegExp(START_IF + '\\s*$')) || comment.match(new RegExp(START_IF + '<!\\s*$')) ||
            comment.match(new RegExp('^' + END_IF))) {
        return comment.trim();
    }

    if (matchedStartIF && matchedEndIF) {
        var start = matchedStartIF[0],
            end = matchedEndIF[0],
            modified = modify(comment.substring(start.length, matchedEndIF.index), options);

        return (start + modified + end).trim();
    }
}

module.exports = {
    sortAttrs: sortAttrs,
    sortCssClasses: sortCssClasses,
    sortAttrsValues: sortAttrsValues,

    removeAttrsValues: removeAttrsValues,
    removeWhitespaces: removeWhitespaces,
    removeDuplicateAttributes: removeDuplicateAttributes,

    getConditionalComment: getConditionalComment
};
