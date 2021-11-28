import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const presets = {
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
 * @param {Boolean}  [options.ignoreSelfClosingSlash=false]
 * returns {Object}
 */
export function defaults(options = {}) {
  if (typeof options === 'string') {
    options = { preset: options };
  }

  if (!options) {
    options = {};
  }

  if (options.preset) {
    const preset = String(options.preset);
    if (!presets.hasOwnProperty(preset)) {
      throw Error(preset + ' is an invalid preset name.');
    }

    delete options.preset;
    options = { ...presets[preset], ...options };
  }

  return {
    ignoreAttributes: [],
    compareAttributesAsJSON: [],

    ignoreWhitespaces: true,
    ignoreComments: true,

    ignoreEndTags: false,
    ignoreSelfClosingSlash: false,

    ...options
  };
};
