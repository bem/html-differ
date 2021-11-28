/**
 * Mask
 * ====
 *
 * {{RegExp}}
 */
const MASK_REGEXP = /(.*){{(.+)}}(?!})(.*)/;
const specialСhars = /([^A-Za-zА-Яа-я0-9_\-\s])/g;

/**
 * Checks whether the given part of the diff should be added or removed
 * @param {Diff} part
 * @returns {Boolean}
 */
function _isDiffPart(part) {
  return part.added || part.removed;
}

/**
 * Removes diff parts which are equal by mask
 * @param {Diff[]} diff
 * @returns {Diff[]}
 */
function _revealMasks(diff) {
  for (let i = 0; i < diff.length; i++) {
    const currPart = diff[i];

    if (!_isDiffPart(currPart)) continue;

    const prevPart = diff[i - 1];
    const nextPart = diff[i + 1];
    const matchedMask = currPart.value.match(MASK_REGEXP);

    if (!matchedMask) continue;

    const regExp = new RegExp('^'
            + matchedMask[1].replace(specialСhars, '\\$1')
                + matchedMask[2]
                    + matchedMask[3].replace(specialСhars, '\\$1') + '$');

    if (currPart.added && prevPart && prevPart.removed) {
      if (prevPart.value.match(regExp)) {
        prevPart.removed = undefined;
        diff.splice(i--, 1);
      }
    } else if (currPart.removed && nextPart && nextPart.added) {
      if (nextPart.value.match(regExp)) {
        nextPart.added = undefined;
        diff.splice(i--, 1);
      }
    }
  }

  return diff;
}

/**
 * Concats not diff parts which go one by one
 * @param {Diff[]} diff
 * @returns {Diff[]}
 */
function _concatNotDiffParts(diff) {
  for (let i = 1; i < diff.length; i++) {
    const currPart = diff[i];
    const prevPart = diff[i - 1];

    if (!_isDiffPart(currPart) && !_isDiffPart(prevPart)) {
      prevPart.value += currPart.value;

      diff.splice(i--, 1);
    }
  }

  return diff;
}

/**
 * @typedef {Object} Diff
 * @property {String} value
 * @property {String|undefined} added
 * @property {String|undefined} removed
 */

/**
 * Handles masks in the given diff
 * @param {Diff[]} diff
 * @returns {Diff[]}
 */
export default function(diff) {
  diff = _revealMasks(diff);

  return _concatNotDiffParts(diff);
};
