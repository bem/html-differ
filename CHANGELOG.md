History of changes
==================

0.5.0
-----

 * Added `ignoreHtmlComments` option.
 * Added [Russian documentation](https://github.com/bem/html-differ/blob/master/README.ru.md).
 * Renamed `ignoreWhitespace` option to `ignoreWhitespaces`.
 * Set the default value of `charsAroundDiff` option to `40`.
 * Removed `verbose` option.
 * Added logging of differences similar to [mocha](https://github.com/visionmedia/mocha).
 * Moved to [htmlparser2](https://github.com/fb55/htmlparser2).

0.4.0
-----

 * Added the handling of `onclick` and `ondblclick` attributes for `compareHtmlAttrsAsJSON` option.
 * Added BEM preset.
 * Added `getDiffText` method to `logger`.
 * Added testing of code coverage and dependencies status.
 * Added JSDocs.
