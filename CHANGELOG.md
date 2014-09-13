History of changes
==================

1.0.0
-----

 * Added options:
  * **ignoreEndTags**
  * **ignoreDuplicateAttributes**
 * Renamed options:
  * **ignoreHtmlAttrs** --> **ignoreAttributes**
  * **compareHtmlAttrsAsJSON** --> **compareAttributesAsJSON**
  * **ignoreHtmlComments** --> **ignoreComments**
 * Changed the way of setting attributes in option **compareAttributesAsJSON**.
 * Changed the way of setting predefined options for [BEM](http://bem.info/).
 * Renamed method **log** to **logDiffText**.
 * Moved to parser [parse5](https://github.com/inikulin/parse5).
 * Add more tests.
 * Fixed bugs.

0.5.0
-----

 * Added **ignoreHtmlComments** option.
 * Added [Russian documentation](https://github.com/bem/html-differ/blob/master/README.ru.md).
 * Renamed **ignoreWhitespace** option to **ignoreWhitespaces**.
 * Set the default value of **charsAroundDiff** option to `40`.
 * Removed **verbose** option.
 * Added logging of differences similar to [mocha](https://github.com/visionmedia/mocha).
 * Moved to parser [htmlparser2](https://github.com/fb55/htmlparser2).

0.4.0
-----

 * Added the handling of **onclick** and **ondblclick** attributes for **compareHtmlAttrsAsJSON** option.
 * Added [BEM](http://bem.info/) preset.
 * Added **getDiffText** method to **logger**.
 * Added testing of code coverage and dependencies status.
 * Added JSDocs.
