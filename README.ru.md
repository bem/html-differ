# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ)

Сравнивает два `HTML`-кода.

## Алгоритм сравнения

`HTML` коды сравниваются так, как это делают **браузеры**, то есть `html-differ` сравнивает `HTML`-коды по следующим критериям:

* Два соответствующих списка атрибутов считаются эквивалентными, даже если они записаны в разном порядке.

Например, cледующие два кода будут считаться эквивалентными:

```html
<span id="blah" class="ololo" tabIndex="1">Text</span>
```

```html
<span tabIndex="1" id="blah" class="ololo">Text</span>
```

* Два соответствующих атрибута `class` считаются эквивалентными, если они ссылаются на одни и те же группы `CSS`-стилей.

Например, cледующие два кода будут считаться эквивалентными:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc">Text</span>
```

* Из списка одинаковых атрибутов тэга, для сравнения будет взят тот, который идет первым, остальные будут проигнорированы.

Например, cледующие два кода будут считаться эквивалентными:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc">Text</span>
```

* Закрывающие тэги не сравниваются

Например, cледующие два кода будут считаться эквивалентными:

```html
<span>Text</span>
```

```html
<span>Text</spane>
```

**ВНИМАНИЕ!** `html-differ` не проверяет валидность `HTML`-кодов, а сравнивает их по выше описанным критериям и задынным опциям (смотрите список возможных опций в [использовании](https://github.com/bem/html-differ/blob/master/README.ru.md#%D0%98%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)).

## Установка

```bash
$ npm install html-differ -g
```

## Использование

###Как js-модуль###

####html-differ####

**html-differ.diffHtml**<br>
**@param** *{String}* - 1-й `HTML`-код<br>
**@param** *{String}* - 2-й `HTML`-код<br>
**@returns** *{Array of objects}* - [массив с отличиями](https://github.com/kpdecker/jsdiff#change-objects) между `HTML`-кодами

**html-differ.isEqual**<br>
**@param** *{String}* - 1-й `HTML`-код<br>
**@param** *{String}* - 2-й `HTML`-код<br>
**@returns** *{Boolean}*

####diff-logger####

**diff-logger.getDiffText**<br>
**@param** *{Array of objects}* - результат работы метода `html-differ.diffHtml`<br>
**@param** *{Object}* - опции:<br>
* `charsAroundDiff: Number` - количество символов перед отличием между `HTML`-кодами и после него (по умолчанию: `40`)

**@returns** *{String}* - отличия

**diff-logger.log**<br>
**@param** *{Array of objects}* - результат работы метода `html-differ.diffHtml`<br>
**@param** *{Object}* - опции:<br>
* `charsAroundDiff: Number` - количество символов перед отличием между `HTML`-кодами и после него (по умолчанию: `40`)

**@returns** - вывод отличий:

<img src='https://cloud.githubusercontent.com/assets/6376693/3648928/a6b9d48a-110d-11e4-8a07-d9b156145017.png'/>

**Пример**

```js
var fs = require('fs'),
    HtmlDiffer = require('html-differ').HtmlDiffer,
    diffLogger = require('html-differ/lib/diff-logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var options = {
    ignoreHtmlAttrs: [],
    compareHtmlAttrsAsJSON: [],
    ignoreWhitespaces: true,
    ignoreHtmlComments: true,
    bem: false
}

var htmlDiffer = new HtmlDiffer(options);

var diff = htmlDiffer.diffHtml(html1, html2);

var isEqual = htmlDiffer.isEqual(html1, html2);

var res = diffLogger.getDiffText(diff, { charsAroundDiff: 40 });

diffLogger.log(diff, { charsAroundDiff: 40 });
```

Где `options` – это `Object`:

* **ignoreHtmlAttrs: [ Array ]**

Устанавливает, значения каких атрибутов следует игнорировать при сравнении (по умолчанию: `[]`).

**Пример**: `['id', 'for']`<br>
Следующие два кода будут считаться эквивалентными:

```html
<label for="random">label for input</label>
<input id="random">
```

```html
<label for="sfsdfksdf">label for input</label>
<input id="sfsdfksdf">
```

* **compareHtmlAttrsAsJSON: [ Array ]**

Устанавливает, значения каких атрибутов следует сравнивать как `JSON`-объекты, а не как строки (по умолчанию: `[]`).

**Пример**: `['onclick']`<br>
Следующие два кода будут считаться эквивалентными:

```html
<div onclick='return {"bla":{"first":"ololo","second":"trololo"}}'></div>
```

```html
<div onclick='return {"bla":{"second":"trololo","first":"ololo"}}'></div>
```

* **ignoreWhitespaces: Boolean**

`html-differ` будет игнорировать пробельные символы (пробелы, табуляция, переводы строк и т. д.) при сравнении (по умолчанию: `true`).

**Пример**: `true`<br>
Следующие два кода будут считаться эквивалентными:

```html
<html>Text Text<head lang="en"><title></title></head><body>Text</body></html>
```

```html
 <html>
 Text   Text
<head        lang     ="en">
    <title                        >               </title>


            </head>

<body>
     Text

    </body>




</html>

```

* **ignoreHtmlComments: Boolean**

`html-differ` будет игнорировать `HTML`-комментарии при сравнении (по умолчанию: `true`).

**Пример**: `true`<br>
Следующие два кода будут считаться эквивалентными:

```html
<!DOCTYPE html>
<!-- comments1 -->
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title><!-- comments2 --></title>
</head>
<body>
Text<!-- comments3 -->
</body>
</html>
```

```html
<!DOCTYPE html>

<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
Text
</body>
</html>
```

* **bem: Boolean**

Устанавливает предопределенные опции для `БЭМ` (по умолчанию: `false`).

**Пример**: `true`

* `ignoreHtmlAttrs: ['id', 'for']`
* `compareHtmlAttrsAsJSON: ['data-bem', 'onclick', 'ondblclick']`


###Как программа###

```bash
$ html-differ --help
Сравнивает два HTML-кода

Использование:
  html-differ [ОПЦИИ] [АРГУМЕНТЫ]

Опции:
  -h, --help : Помощь
  -v, --version : Показывает номер версии
  --config=CONFIG : Путь к конфигурационному JSON-файлу
  --chars-around-diff=CHARSAROUNDDIFF : Количество символов перед отличием и после него (по умолчанию: 40)

Аргументы:
  PATH1 : Путь к 1-ому HTML-файлу (обязательный аргумент)
  PATH2 : Путь ко 2-ому HTML-файлу (обязательный аргумент)
```

**Пример**

```bash
$ bin/html-differ путь/к/html1 путь/к/html2

$ bin/html-differ --config=путь/к/конфигу --chars-around-diff=40 путь/к/html1 путь/к/html2
```

####Конфигурационный файл###

Рассмотрите следующий файл `config.json`:

```js
{
    "ignoreHtmlAttrs": [],
    "compareHtmlAttrsAsJSON": [],
    "ignoreWhitespaces": true,
    "ignoreHtmlComments": true,
    "bem": false
}
```

## Лицензия

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
