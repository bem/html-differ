# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ) [![devDependency Status](https://david-dm.org/bem/html-differ/dev-status.svg)](https://david-dm.org/bem/html-differ#info=devDependencies)

Сравнивает два HTML.

<!-- TOC -->
- [Алгоритм сравнения](#Алгоритм-сравнения)
- [Установка](#Установка)
- [API](#api)
  - [HtmlDiffer](#htmldiffer)
    - [Опции](#Опции)
      - [ignoreAttributes](#ignoreattributes-array)
      - [compareAttributesAsJSON](#compareattributesasjson-array)
      - [ignoreWhitespaces](#ignorewhitespaces-boolean)
      - [ignoreComments](#ignorecomments-boolean)
      - [ignoreEndTags](#ignoreendtags-boolean)
      - [ignoreDuplicateAttributes](#ignoreduplicateattributes-boolean)
    - [Пресеты](#Пресеты)
      - [Использование](#Использование)
    - [Методы](#Методы)
      - [htmlDiffer.diffHtml](#htmldifferdiffhtml)
      - [htmlDiffer.isEqual](#htmldifferisequal)
  - [Logger](#logger)
    - [Методы](#Методы-1)
      - [logger.getDiffText](#loggergetdifftext)
      - [logger.logDiffText](#loggerlogdifftext)
  - [Пример](#Пример)
- [Использование в качестве программы](#Использование-в-качестве-программы)
  - [Пример](#Пример-1)
  - [Конфигурационный файл](#Конфигурационный-файл)
- [Маски](#Маски)
  - [Синтаксис](#Синтаксис)
  - [Экранирование](#Экранирование)

<!-- TOC END -->

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

Например, следующие два HTML будут считаться эквивалентными:

```html
<span id="1"></span>
```

```html
<span id=
    "1"    ></span   >
```

* Два соответствующих списка атрибутов считаются эквивалентными, даже если они записаны в разном порядке.

Например, следующие два HTML будут считаться эквивалентными:

```html
<span id="blah" class="ololo" tabIndex="1">Text</span>
```

```html
<span tabIndex="1" id="blah" class="ololo">Text</span>
```

* Два соответствующих атрибута `class` считаются эквивалентными, если они ссылаются на одни и те же группы CSS-стилей.

Например, следующие два HTML будут считаться эквивалентными:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc bc">Text</span>
```

**ВНИМАНИЕ!**<br>
**html-differ** не проверяет валидность HTML, а сравнивает их по вышеуказанным критериям и заданным опциям (смотрите список возможных [опций](https://github.com/bem/html-differ/blob/master/README.ru.md#%D0%9E%D0%BF%D1%86%D0%B8%D0%B8)).

## Установка

```bash
$ npm install html-differ
```

## API

###HtmlDiffer###

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer(options);
```

где `options` – это объект.

#### Опции

<!-- TOC:display:ignoreAttributes -->
##### ignoreAttributes: [Array]

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

<!-- TOC:display:compareAttributesAsJSON -->
##### compareAttributesAsJSON: [Array]

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

<!-- TOC:display:ignoreWhitespaces -->
##### ignoreWhitespaces: Boolean

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

<!-- TOC:display:ignoreComments -->
##### ignoreComments: Boolean

**html-differ** будет игнорировать HTML-комментарии при сравнении (по умолчанию: `true`).

**ПРИМЕЧАНИЕ!**<br>
[Условные комментарии](https://ru.wikipedia.org/wiki/Условный_комментарий) не игнорируются.

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<!DOCTYPE html>
<!-- comments1 -->
<html>
<head lang="en">
    <meta charset="UTF-8">
    <!--[if IE]>
        <link rel="stylesheet" type="text/css" href="all-ie-only.css" />
    <![endif]-->
    <!--[if !IE]><!-->
        <link href="non-ie.css" rel="stylesheet">
    <!--<![endif]-->
</head>
<body>
Text<!-- comments2 -->
</body>
</html>
```

```html
<!DOCTYPE html>

<html>
<head lang="en">
    <meta charset="UTF-8">
    <!--[if IE]>
        <link href="all-ie-only.css" type="text/css" rel="stylesheet"/>
    <![endif]-->
    <!--[if !IE]><!-->
        <link href="non-ie.css" rel="stylesheet">
    <!--<![endif]-->
</head>
<body>
Text
</body>
</html>
```

<!-- TOC:display:ignoreEndTags -->
##### ignoreEndTags: Boolean

**html-differ** будет игнорировать закрывающие тэги при сравнении (по умолчанию: `false`).

**Пример**: `true`<br>
Следующие два HTML будут считаться эквивалентными:

```html
<span>Text</span>
```

```html
<span>Text</spane>
```

<!-- TOC:display:ignoreDuplicateAttributes -->
##### ignoreDuplicateAttributes: Boolean

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

#### Пресеты

* [bem](https://github.com/bem/html-differ/blob/master/presets/bem.json) - уставливает предопределенные опции для [БЭМ](http://ru.bem.info/).


##### Использование

Передача пресета конструктору:

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer('bem');
```

Переопределение пресета через конструктор:

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer({ preset: 'bem', ignoreAttributes: [] });
```

#### Методы

##### htmlDiffer.diffHtml

**@param** *{String}* - 1-й HTML<br>
**@param** *{String}* - 2-й HTML<br>
**@returns** *{Array of objects}* - [массив с отличиями](https://github.com/kpdecker/jsdiff#change-objects) между HTML

##### htmlDiffer.isEqual

**@param** *{String}* - 1-й HTML<br>
**@param** *{String}* - 2-й HTML<br>
**@returns** *{Boolean}*

### Logger

```js
var logger = require('html-differ/lib/logger');
```

#### Методы

##### logger.getDiffText

**@param** *{Array of objects}* - результат работы метода [htmlDiffer.diffHtml](https://github.com/bem/html-differ/blob/master/README.ru.md#htmldifferdiffhtml)<br>
**@param** *{Object}* - опции:<br>

* **charsAroundDiff: Number** - количество символов перед отличием между HTML и после него (по умолчанию: `40`)

**@returns** *{String}*

##### logger.logDiffText

**@param** *{Array of objects}* - результат работы метода [htmlDiffer.diffHtml](https://github.com/bem/html-differ/blob/master/README.ru.md#htmldifferdiffhtml)<br>
**@param** *{Object}* - опции:<br>

* **charsAroundDiff: Number** - количество символов перед отличием между HTML и после него (по умолчанию: `40`)

**@returns** - вывод отличий:

<img src='https://cloud.githubusercontent.com/assets/6376693/3648928/a6b9d48a-110d-11e4-8a07-d9b156145017.png'/>

### Пример

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

## Использование в качестве программы

```bash
$ html-differ --help
Сравнивает два HTML

Использование:
  html-differ [ОПЦИИ] [АРГУМЕНТЫ]

Опции:
  -h, --help : Помощь
  -v, --version : Показывает номер версии
  --config=CONFIG : Путь к конфигурационному JSON-файлу
  --bem : Использует предопределенные опции для БЭМ (устаревшая опция)
  -p PRESET, --preset=PRESET : Имя пресета
  --chars-around-diff=CHARSAROUNDDIFF : Количество символов перед отличием и после него (по умолчанию: 40)

Аргументы:
  PATH1 : Путь к 1-ому HTML-файлу (обязательный аргумент)
  PATH2 : Путь ко 2-ому HTML-файлу (обязательный аргумент)
```

### Пример

```bash
$ html-differ путь/к/html1 путь/к/html2

$ html-differ --config=путь/к/конфигу --chars-around-diff=40 путь/к/html1 путь/к/html2

$ html-differ --preset=bem путь/к/html1 путь/к/html2
```

### Конфигурационный файл

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

## Маски

**html-differ** поддерживает использование _масок_ в HTML.

Например, следующие два HTML будут считаться эквивалентными:

```html
<div id="{{[a-z]*\s\d+}}">
```

```html
<div id="text 12345">
```

### Синтаксис

Для записи _масок_ в **html-differ** используется следующий синтаксис:

```js
{{RegExp}}
```

где:

* `{{` – открывающий идентификатор _маски_.

* `RegExp` – регулярное выражение для сопоставления с соответствующим значением в сравниваемом HTML. Имеет такой же синтаксис как и регулярные выражения в JavaScript, записанные в _literal notation_.

* `}}` – закрывающий идентификатор _маски_.

### Экранирование

Правила экранирования символов такие же как и при использовании регулярных выражений в JavaScript, записанных в _literal notation_.

Например, следующие два HTML будут считаться эквивалентными:

```html
<div id="{{\d\.\d}}">
```

```html
<div id="1.1">
```

Если вы хотите хотите использовать `{{` или `}}` внутри маски, вам необходимо экранировать обе фигурные скобки, то есть `\{\}` или `\}\}`

Например, следующие два HTML будут считаться эквивалентными:

```html
<div class="{{a\{\{b\}\}c}}">
```

```html
<div class="a{{b}}c">
```
