История изменений
==================

1.0.3
-----

* Улучшена токенизация входных данных и сериализация значений атрибутов ([PR110](https://github.com/bem/html-differ/pull/110)).

1.0.2
-----

* Изменен _БЭМ-пресет_. В опцию **ignoreAttributes** добавлены атрибуты `aria-labelledby` и `aria-describedby`.

1.0.1
-----

* Исправлена ошибка в опции `compareAttributesAsJSON`, возникающая при некоректных входных данных ([issue106](https://github.com/bem/html-differ/issues/106)).

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
