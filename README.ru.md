# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ) [![devDependency Status](https://david-dm.org/bem/html-differ/dev-status.svg)](https://david-dm.org/bem/html-differ#info=devDependencies)

Сравнивает два HTML.

## Алгоритм сравнения

**html-differ** сравнивает HTML по следующим критериям:

* Декларации `<!DOCTYPE>` не чувствителны к регистру, поэтому следующие два HTML будут считаться эквивалентными:

```html
<!DOCTYPE HTML PUBLIC "_PUBLIC" "_SYSTEM">
```

```html
<!doctype html public "_PUBLIC" "_SYSTEM">
```

* Пробельные символы (пробелы, табуляция, переводы строк и т. д.) внутри открывающих и закрывающих тэгов игнорируются при сравнении.

Например, cледующие два HTML будут считаться эквивалентными:

```html
<span id="1"></span>
```

```html
<span id=
    "1"    ></span   >
```

* Два соответствующих списка атрибутов считаются эквивалентными, даже если они записаны в разном порядке.

Например, cледующие два HTML будут считаться эквивалентными:

```html
<span id="blah" class="ololo" tabIndex="1">Text</span>
```

```html
<span tabIndex="1" id="blah" class="ololo">Text</span>
```

* Два соответствующих атрибута `class` считаются эквивалентными, если они ссылаются на одни и те же группы CSS-стилей.

Например, cледующие два HTML будут считаться эквивалентными:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc">Text</span>
```

**ВНИМАНИЕ!**<br>
**html-differ** не проверяет валидность HTML, а сравнивает их по вышеуказанным критериям и задынным опциям (смотрите список возможных опций в [API](https://github.com/bem/html-differ/blob/master/README.ru.md#api)).

## Установка

```bash
$ npm install html-differ -g
```

## API

###HtmlDiffer###

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer(options);
```

Где `options` – это объект:

* **ignoreAttributes: [ Array ]**

Устанавливает, значения каких атрибутов следует игнорировать при сравнении (по умолчанию: `[]`).

**Пример**: `['id', 'for']`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<label for="random">Text</label>
<input id="random">
```

```html
<label for="sfsdfksdf">Text</label>
<input id="sfsdfksdf">
```

* **compareAttributesAsJSON: [ Array ]**

Устанавливает, значения каких атрибутов следует сравнивать как JSON-объекты, а не как строки (по умолчанию: `[]`).<br>
В тех случаях, когда в качестве значения атрибута выступает некорректный JSON или это значение нельзя обернуть в функцию, то оно будет сравниваться как `undefined`.

**Пример**: `[{ name: 'data', isFunction: false }, { name: 'onclick', isFunction: true }]`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<div data='{"bla":{"first":"ololo","second":"trololo"}}'></div>
<span onclick='return {"aaa":"bbb","bbb":"aaa"}'></span>

<button data='REALLY BAD JSON'></button>
<button onclick='REALLY BAD FUNCTION'></button>
```

```html
<div data='{"bla":{"second":"trololo","first":"ololo"}}'></div>
<span onclick='return {"bbb":"aaa","aaa":"bbb"}'></span>

<button data='undefined'></button>
<button onclick='undefined'></button>
```

**ПРИМЕЧАНИЕ!**<br>
Первый элемент массива мог быть записан в короткой форме в качестве строки:<br>
`['data', { name: 'onclick', isFunction: true }]`.

* **ignoreWhitespaces: Boolean**

**html-differ** будет игнорировать пробельные символы (пробелы, табуляция, переводы строк и т. д.) при сравнении (по умолчанию: `true`).

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<html>Text Text<head lang="en"><title></title></head><body>Text</body></html>
```

```html
 <html>
 Text   Text
<head lang="en">
    <title>               </title>


            </head>

<body>
     Text

    </body>




</html>

```

* **ignoreComments: Boolean**

**html-differ** будет игнорировать HTML-комментарии при сравнении (по умолчанию: `true`).

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

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

* **ignoreEndTags: Boolean**

**html-differ** будет игнорировать закрывающие тэги при сравнении (по умолчанию: `false`).

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<span>Text</span>
```

```html
<span>Text</spane>
```

* **ignoreDuplicateAttributes: Boolean**

**html-differ** будет игнорировать повторяющиеся атрибуты.<br>
Из списка одинаковых атрибутов тэга, для сравнения будет взят тот, который идет первым, остальные будут проигнорированы (по умолчанию: `false`).

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<span id="blah" id="ololo">Text</span>
```

```html
<span id="blah">Text</span>
```

**БЭМ-пресет**

Вы можете установить предопределенные опции для [БЭМ](http://ru.bem.info/) с помощью _пресета_:

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer('bem');
```

Опции будут предопределены:

```js
{
    ignoreAttributes: ['id', 'for', 'aria-labelledby', 'aria-describedby'],
    compareAttributesAsJSON: [
        'data-bem',
        { name: 'onclick', isFunction: true },
        { name: 'ondblclick', isFunction: true }
    ],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: false,
    ignoreDuplicateAttributes: false
}
```

####Методы####

**htmlDiffer.diffHtml**<br>
**@param** *{String}* - 1-й HTML<br>
**@param** *{String}* - 2-й HTML<br>
**@returns** *{Array of objects}* - [массив с отличиями](https://github.com/kpdecker/jsdiff#change-objects) между HTML

**htmlDiffer.isEqual**<br>
**@param** *{String}* - 1-й HTML<br>
**@param** *{String}* - 2-й HTML<br>
**@returns** *{Boolean}*

###Logger###

```js
var logger = require('html-differ/lib/logger');
```

####Методы####

**logger.getDiffText**<br>
**@param** *{Array of objects}* - результат работы метода **htmlDiffer.diffHtml**<br>
**@param** *{Object}* - опции:<br>

* **charsAroundDiff: Number** - количество символов перед отличием между HTML и после него (по умолчанию: `40`)

**@returns** *{String}*

**logger.logDiffText**<br>
**@param** *{Array of objects}* - результат работы метода **htmlDiffer.diffHtml**<br>
**@param** *{Object}* - опции:<br>

* **charsAroundDiff: Number** - количество символов перед отличием между HTML и после него (по умолчанию: `40`)

**@returns** - вывод отличий:

<img src='https://cloud.githubusercontent.com/assets/6376693/3648928/a6b9d48a-110d-11e4-8a07-d9b156145017.png'/>

###Пример###

```js
var fs = require('fs'),
    HtmlDiffer = require('html-differ').HtmlDiffer,
    logger = require('html-differ/lib/logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var options = {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    };

var htmlDiffer = new HtmlDiffer(options);

var diff = htmlDiffer.diffHtml(html1, html2),
    isEqual = htmlDiffer.isEqual(html1, html2),
    res = logger.getDiffText(diff, { charsAroundDiff: 40 });

logger.logDiffText(diff, { charsAroundDiff: 40 });
```

##Использование в качестве программы##

```bash
$ html-differ --help
Сравнивает два HTML

Использование:
  html-differ [ОПЦИИ] [АРГУМЕНТЫ]

Опции:
  -h, --help : Помощь
  -v, --version : Показывает номер версии
  --config=CONFIG : Путь к конфигурационному JSON-файлу
  --bem : Использует предопределенные опции для БЭМ
  --chars-around-diff=CHARSAROUNDDIFF : Количество символов перед отличием и после него (по умолчанию: 40)

Аргументы:
  PATH1 : Путь к 1-ому HTML-файлу (обязательный аргумент)
  PATH2 : Путь ко 2-ому HTML-файлу (обязательный аргумент)
```

###Пример###

```bash
$ html-differ путь/к/html1 путь/к/html2

$ html-differ --config=путь/к/конфигу --chars-around-diff=40 путь/к/html1 путь/к/html2

$ html-differ --bem путь/к/html1 путь/к/html2
```

###Конфигурационный файл###

Рассмотрите следующий файл `config.json`:

```js
{
    "ignoreAttributes": [],
    "compareAttributesAsJSON": [],
    "ignoreWhitespaces": true,
    "ignoreComments": true,
    "ignoreEndTags": false,
    "ignoreDuplicateAttributes": false
}
```
