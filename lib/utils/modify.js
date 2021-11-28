import SAXParser from 'parse5-sax-parser';
import * as serialize from './serialize.js';
import * as utils from './utils.js';

/**
 * Parses the given HTML and modifies it according to the given options
 * @param {String} value
 * @param {Object}   [options]
 * @param {String[]} [options.ignoreAttributes]
 * @param {String[]} [options.compareAttributesAsJSON]
 * @param {Boolean}  [options.ignoreWhitespaces=true]
 * @param {Boolean}  [options.ignoreComments=true]
 * @param {Boolean}  [options.ignoreEndTags=false]
 * @param {Boolean}  [options.ignoreSelfClosingSlash=false]
 * returns {String}
 */
export default function modify(value, options) {
  return new Promise((resolve, reject) => {
    const modifiedValues = [];
    const parser = new SAXParser();

    /**
       * @param {object} doctypeToken
       * @param {String} doctypeToken.name
       * @param {String} doctypeToken.publicId
       * @param {String} doctypeToken.systemId
       */
    parser.on('doctype', function(doctypeToken) {
      const name = doctypeToken.name;
      const publicId = doctypeToken.publicId;
      const systemId = doctypeToken.systemId;

      modifiedValues.push(serialize.doctype(name, publicId, systemId));
    });

    /**
       * @param {object} startTagToken
       * @param {String} startTagToken.tagName
       * @param {Array} startTagToken.attrs
       * @param {Boolean} startTagToken.selfClosing
       */
    parser.on('startTag', function(startTagToken) {
      let attrs = startTagToken.attrs;
      let selfClosing = startTagToken.selfClosing;
      const tagName = startTagToken.tagName;

      if (options.ignoreSelfClosingSlash) {
        selfClosing = false;
      }

      attrs = utils.sortAttrs(attrs)
                      && utils.sortCssClasses(attrs)
                          && utils.sortAttrsValues(attrs, options.compareAttributesAsJSON)
                              && utils.removeAttrsValues(attrs, options.ignoreAttributes);

      modifiedValues.push(serialize.startTag(tagName, attrs, selfClosing));
    });

    /**
       * @param {object} endTagToken
       * @param {String} endTagToken.tagName
       */
    parser.on('endTag', function(endTagToken) {
      const tagName = endTagToken.tagName;

      if (!options.ignoreEndTags) {
        modifiedValues.push(serialize.endTag(tagName));
      }
    });

    /**
       * @param {object} textToken
       * @param {String} textToken.text
       */
    parser.on('text', function(textToken) {
      let text = textToken.text;

      options.ignoreWhitespaces && (text = utils.removeWhitespaces(text));

      modifiedValues.push(serialize.text(text));
    });

    /**
       * @param {object} commentToken
       * @param {String} commentToken.text
       */
    parser.on('comment', function(commentToken) {
      modifiedValues.push(new Promise(resolve => {
        const comment = commentToken.text;
        resolve(utils.getConditionalComment(comment, modify, options));
      }).then(conditionalComment => {
        if (conditionalComment) {
          return serialize.comment(conditionalComment);
        } else if (!options.ignoreComments) {
          return serialize.comment(commentToken.text);
        }
      }));
    });

    parser.on('end', async function() {
      const values = await Promise.all(modifiedValues);
      resolve(values.join(''));
    });

    parser.on('error', function(err) {
      reject(err);
    });

    parser.end(value);
  });
}
