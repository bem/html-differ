История изменений
==================

0.5.0
-----

 * Добавлена опция `ignoreHtmlComments`.
 * Добавлена [русская документация](https://github.com/bem/html-differ/blob/master/README.ru.md).
 * Опция `ignoreWhitespace` переименована в `ignoreWhitespaces`.
 * Значение опции `charsAroundDiff` по умолчанию теперь равно `40`.
 * Удалена опция `verbose`.
 * Вывод отличий теперь похож на тот, который использует [mocha](https://github.com/visionmedia/mocha).
 * Переход на использование [htmlparser2](https://github.com/fb55/htmlparser2).

0.4.0
-----

 * Добавлена обработка `onclick` и `ondblclick` атрибутов для опции `compareHtmlAttrsAsJSON`.
 * Добавлен БЭМ-пресет.
 * Добавлен метод `getDiffText` в `logger`.
 * Добавлено тестирование покрытия кода и статуса зависимостей.
 * Добавлены JSDocs.
