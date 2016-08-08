History of changes
==================

1.3.4
-----

* Fixed option [compareAttributesAsJSON](https://github.com/bem/html-differ/tree/v1.3.4#compareattributesasjson-array) (see [#142]).

1.3.3
-----

* Fixed the bug with comparison of duplicate `css` classes (see [#138]).
* Added supporting of `node@0.12.x` and `node@4.x`.

1.3.2
-----

* Fixed the bug with comparison of screened text (see [#131]).

1.3.1
-----

* Improved tokenization of input for better logging of differences.

1.3.0
-----

* **bem** option was declared as _deprecated_. **preset** option should be used instead.
* Added the ability of redefinition of _presets_.
* Fixed bug in handling of _masks_ in HTML.

1.2.0
-----

* BROKEN.

1.1.0
-----

* Added supporting of [masks](https://github.com/bem/html-differ#masks) in HTML.

1.0.8
-----

* _Сonditional comments_ are not ignored regardless of the value of option **ignoreComments** (see [#116]).
* Changed _BEM preset_, set option **ignoreComments** to `true`.

1.0.7
-----

* Updated `keywords` in `package.json`.
* Added file `.npmignore`.

1.0.6
-----

* Fixed _BEM preset_, set option **ignoreComments** to `false`.

1.0.5
-----

* Removed unnecessary files from `npm`.

1.0.4
-----

* Improved tokenization of input for better logging of differences (see [#111]).

1.0.3
-----

* Improved tokenization of input and serialization of attributes' values (see [#110]).

1.0.2
-----

* _BEM preset_ was changed. Attributes `aria-labelledby` and `aria-describedby` were added to option **ignoreAttributes**.

1.0.1
-----

* Fixed crash with option `compareAttributesAsJSON` concerning the invalid input (see [#106]).

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

[#142]: https://github.com/bem/html-differ/pull/142
[#138]: https://github.com/bem/html-differ/issues/138
[#131]: https://github.com/bem/html-differ/issues/131
[#106]: https://github.com/bem/html-differ/issues/106
[#110]: https://github.com/bem/html-differ/pull/110
[#111]: https://github.com/bem/html-differ/pull/111
[#116]: https://github.com/bem/html-differ/issues/116
