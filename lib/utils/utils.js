/**
 * Gets the attribute's indexes in the array of the attributes
 * @param {Array} attrs
 * @param {String} attr
 * @returns {Array}
 */
function _getIndexesInArray(attrs, attr) {
  const res = [];

  for (let i = 0; i < attrs.length; i++) {
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
  return attrs.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
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
    const classList = [...new Set((cssClasses || '').split(' ').filter(i => i))];
    classList.sort();
    return classList.join(' ');
  }

  const classIndexes = _getIndexesInArray(attrs, 'class');

  classIndexes.forEach(function(index) {
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
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
      return '[' + obj.map(_sortObj).join(',') + ']';
    }

    const keys = Object.keys(obj);
    keys.sort();

    return '{'
            + keys
              .map(function(key) {
                return JSON.stringify(key) + ':' + _sortObj(obj[key]);
              })
              .join(',')
            + '}';
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
        // eslint-disable-next-line no-new-func
        const fn = Function(val);

        return fn ? fn() : {};
      }

      return JSON.parse(val);
    } catch (err) {
      return undefined;
    }
  }

  compareAttributesAsJSON.forEach(function(attr) {
    if (typeof attr === 'string') {
      const name = attr;
      attr = {};
      attr.name = name;
      attr.isFunction = false;
    }

    let attrValue;
    const isFunction = (attr.isFunction);
    const attrIndexes = _getIndexesInArray(attrs, attr.name);

    attrIndexes.forEach(function(index) {
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
  ignoreAttributes.forEach(function(attr) {
    const attrIndexes = _getIndexesInArray(attrs, attr);

    attrIndexes.forEach(function(index) {
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
    .replace(/[\n\r\t\v\f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Processes a conditional comment
 * @param {String} comment
 * @param {Function} modify
 * @param {Object} options
 * @returns {String|undefined}
 */
async function getConditionalComment(comment, modify, options) {
  const START_IF = '^\\s*\\[if .*\\]>';
  const END_IF = '<!\\[endif\\]\\s*$';
  const matchedStartIF = comment.match(new RegExp(START_IF));
  const matchedEndIF = comment.match(new RegExp(END_IF));

  if (comment.match(new RegExp(START_IF + '\\s*$')) || comment.match(new RegExp(START_IF + '<!\\s*$')) || comment.match(new RegExp('^' + END_IF))) {
    return comment.trim();
  }

  if (matchedStartIF && matchedEndIF) {
    const start = matchedStartIF[0];
    const end = matchedEndIF[0];
    const modified = await modify(comment.substring(start.length, matchedEndIF.index), options);

    return (start + modified + end).trim();
  }
}

function htmlEntities(str) {
  const map = {
    '&': '&amp;',
    "'": '&#39;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return str.replace(/[&"'<>]/g, function(c) {
    return map[c];
  });
}

module.exports = {
  sortAttrs: sortAttrs,
  sortCssClasses: sortCssClasses,
  sortAttrsValues: sortAttrsValues,

  removeAttrsValues: removeAttrsValues,
  removeWhitespaces: removeWhitespaces,

  getConditionalComment: getConditionalComment,

  htmlEntities: htmlEntities
};
