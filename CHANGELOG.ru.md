История изменений
=================

1.3.4
-----

* Исправлена работа опции [compareAttributesAsJSON](https://github.com/bem/html-differ/blob/v1.3.4/README.ru.md#compareattributesasjson-array) (подробнее [#142]).

1.3.3
-----

* Исправлена ошибка при сравнении повторяющихся `css` классов (подробнее [#138]).
* Добавлена поддержка `node@0.12.x` и `node@4.x`.

1.3.2
-----

* Исправлена ошибка при сравнении экранированного текста (подробнее [#131]).

1.3.1
-----

* Улучшена токенизация входных данных для более точного вывода отличий.

1.3.0
-----

* Опция **bem** объявлена _устаревшей_. Вместо нее необходимо использовать опцию **preset**.
* Добавлена возможность переопределения _пресетов_.
* Исправлена ошибка при обработке _масок_ в HTML.

1.2.0
-----

* ПОЛОМАНА.

1.1.0
-----

* Добавлена поддержка [масок](https://github.com/bem/html-differ/blob/master/README.ru.md#%D0%9C%D0%B0%D1%81%D0%BA%D0%B8) в HTML.

1.0.8
-----

* _Условные комментарии_ учитываются при сравнении всегда, в не зависимости от значения опции **ignoreComments** (подробнее [#116]).
* Изменен _БЭМ-пресет_, значение опции **ignoreComments** стало `true`.

1.0.7
-----

* Обновлены `keywords` в `package.json`.
* Добавлен файл `.npmignore`.

1.0.6
-----

* Исправлен _БЭМ-пресет_, значение опции **ignoreComments** стало `false`.

1.0.5
-----

* Удалены ненужные файлы из `npm`.

1.0.4
-----

* Улучшена токенизация входных данных для более точного вывода отличий (подробнее [#111]).

1.0.3
-----

* Улучшена токенизация входных данных и сериализация значений атрибутов (подробнее [#110]).

1.0.2
-----

* Изменен _БЭМ-пресет_. В опцию **ignoreAttributes** добавлены атрибуты `aria-labelledby` и `aria-describedby`.

1.0.1
-----

* Исправлена ошибка в опции `compareAttributesAsJSON`, возникающая при некоректных входных данных (подробнее [#106]).

1.0.0
-----

 * Добавлены опции:
  * **ignoreEndTags**
  * **ignoreDuplicateAttributes**
 * Переименованы опции:
  * **ignoreHtmlAttrs** --> **ignoreAttributes**
  * **compareHtmlAttrsAsJSON** --> **compareAttributesAsJSON**
  * **ignoreHtmlComments** --> **ignoreComments**
 * Изменен способ задания атрибутов у опции **compareAttributesAsJSON**.
 * Изменен способ задания опций для [БЭМ](http://ru.bem.info/).
 * Переименован метод **log** в **logDiffText**.
 * Переход на использование парсера [parse5](https://github.com/inikulin/parse5).
 * Добавлено больше тестов.
 * Исправлены баги.

0.5.0
-----

 * Добавлена опция **ignoreHtmlComments**.
 * Добавлена [русская документация](https://github.com/bem/html-differ/blob/master/README.ru.md).
 * Опция **ignoreWhitespace** переименована в **ignoreWhitespaces**.
 * Значение опции **charsAroundDiff** по умолчанию теперь равно `40`.
 * Удалена опция **verbose**.
 * Вывод отличий теперь похож на тот, который использует [mocha](https://github.com/visionmedia/mocha).
 * Переход на использование парсера [htmlparser2](https://github.com/fb55/htmlparser2).

0.4.0
-----

 * Добавлена обработка **onclick** и **ondblclick** атрибутов для опции **compareHtmlAttrsAsJSON**.
 * Добавлен [БЭМ](http://ru.bem.info/)-пресет.
 * Добавлен метод **getDiffText** в **logger**.
 * Добавлено тестирование покрытия кода и статуса зависимостей.
 * Добавлены JSDocs.

[#142]: https://github.com/bem/html-differ/pull/142
[#138]: https://github.com/bem/html-differ/issues/138
[#131]: https://github.com/bem/html-differ/issues/131
[#106]: https://github.com/bem/html-differ/issues/106
[#110]: https://github.com/bem/html-differ/pull/110
[#111]: https://github.com/bem/html-differ/pull/111
[#116]: https://github.com/bem/html-differ/issues/116
