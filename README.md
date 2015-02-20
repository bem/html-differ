# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ) [![devDependency Status](https://david-dm.org/bem/html-differ/dev-status.svg)](https://david-dm.org/bem/html-differ#info=devDependencies)

Compares two HTML.

## The comparison algorithm

**html-differ** compares HTML using the following criteria:

* `<!DOCTYPE>` declarations are case-insensitive, so the following two code samples will be considered to be equivalent:

```html
<!DOCTYPE HTML PUBLIC "_PUBLIC" "_SYSTEM">
```

```html
<!doctype html public "_PUBLIC" "_SYSTEM">
```

* Whitespaces (spaces, tabs, new lines etc.) inside start and end tags are ignored during the comparison.

For example, the following two code samples will be considered to be equivalent:

```html
<span id="1"></span>
```

```html
<span id=
    "1"    ></span   >
```

* Two respective lists of attributes are considered to be equivalent even if they are specified in different order.

For example, the following two code samples will be considered to be equivalent:

```html
<span id="blah" class="ololo" tabIndex="1">Text</span>
```

```html
<span tabIndex="1" id="blah" class="ololo">Text</span>
```

* Two respective attributes `class` are considered to be equivalent if they refer to the same groups of CSS styles.

For example, the following two code samples will be considered to be equivalent:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc">Text</span>
```

**CAUTION!**<br>
**html-differ** does not check the validity of HTML, but compares them using the above shown criteria and specified options (see the list of possible options in the [API](https://github.com/bem/html-differ#api)).

## Install

```bash
$ npm install html-differ -g
```

## API

###HtmlDiffer###

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer(options);
```

where `options` is an object:

* **ignoreAttributes: [ Array ]**

Sets what kind of respective attributes' content will be ignored during the comparison (default: `[]`).

**Example**: `['id', 'for']`<br>
The following two code samples will be considered to be equivalent:

```html
<label for="random">Text</label>
<input id="random">
```

```html
<label for="sfsdfksdf">Text</label>
<input id="sfsdfksdf">
```

* **compareAttributesAsJSON: [ Array ]**

Sets what kind of respective attributes' content will be compared as JSON objects, but not as strings (default: `[]`).<br>
In cases when the value of the attribute is an invalid JSON or can not be wrapped into a function, it will be compared as `undefined`.

**Example**: `[{ name: 'data', isFunction: false }, { name: 'onclick', isFunction: true }]`<br>
The following two code samples will be considered to be equivalent:

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

**REMARK!**<br>
The first element of the array could be written in a short form as string:<br>
`['data', { name: 'onclick', isFunction: true }]`.

* **ignoreWhitespaces: Boolean**

Makes **html-differ** ignore whitespaces (spaces, tabs, new lines etc.) during the comparison (default: `true`).

**Example**: `true`<br>
The following two code samples will be considered to be equivalent:

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

Makes **html-differ** ignore HTML comments during the comparison (default: `true`).

**REMARK!**<br>
Does not ignore [conditional comments](http://en.wikipedia.org/wiki/Conditional_comment).


**Example**: `true`<br>
The following two code samples will be considered to be equivalent:

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

* **ignoreEndTags: Boolean**

Makes **html-differ** ignore end tags during the comparison (default: `false`).

**Example**: `true`<br>
The following two code samples will be considered to be equivalent:

```html
<span>Text</span>
```

```html
<span>Text</spane>
```

* **ignoreDuplicateAttributes: Boolean**

Makes **html-differ** ignore tags' duplicate attributes during the comparison.<br>
From the list of the same tag's attributes, the attribute which goes the first will be taken for comparison, others will be ignored (default: `false`).

**Example**: `true`<br>
For example, the following two code samples will be considered to be equivalent:

```html
<span id="blah" id="ololo">Text</span>
```

```html
<span id="blah">Text</span>
```

**BEM preset**

You can set predefined options for [BEM](http://bem.info/) using the _preset_:

```js
var HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer('bem');
```

The options will be predefined:

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

####Methods####

**htmlDiffer.diffHtml**<br>
**@param** *{String}* - the 1-st HTML code<br>
**@param** *{String}* - the 2-nd HTML code<br>
**@returns** *{Array of objects}* - [array with diffs](https://github.com/kpdecker/jsdiff#change-objects) between HTML

**htmlDiffer.isEqual**<br>
**@param** *{String}* - the 1-st HTML code<br>
**@param** *{String}* - the 2-nd HTML code<br>
**@returns** *{Boolean}*


###Logger###

```js
var logger = require('html-differ/lib/logger');
```

####Methods####

**logger.getDiffText**<br>
**@param** *{Array of objects}* - the result of the work of the method **htmlDiffer.diffHtml**<br>
**@param** *{Object}* - options:<br>

* **charsAroundDiff: Number** - the number of characters around the diff result between two HTML (default: `40`).

**@returns** *{String}*

**logger.logDiffText**<br>
**@param** *{Array of objects}* - the result of the work of the method **htmlDiffer.diffHtml**<br>
**@param** *{Object}* - options:<br>

* **charsAroundDiff: Number** - the number of characters around the diff result between two HTML (default: `40`).

**@returns** - pretty logging of diffs:

<img src='https://cloud.githubusercontent.com/assets/6376693/3648928/a6b9d48a-110d-11e4-8a07-d9b156145017.png'/>


###Example###

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

##Usage as a program##

```bash
$ html-differ --help
Compares two HTML

Usage:
  html-differ [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  --config=CONFIG : Path to configuration JSON file
  --bem : Uses predefined options for BEM
  --chars-around-diff=CHARSAROUNDDIFF : The number of characters around the diff (default: 40)

Arguments:
  PATH1 : Path to the 1-st HTML file (required)
  PATH2 : Path to the 2-nd HTML file (required)
```

###Example###

```bash
$ html-differ path/to/html1 path/to/html2

$ html-differ --config=path/to/config --chars-around-diff=40 path/to/html1 path/to/html2

$ html-differ --bem path/to/html1 path/to/html2
```

###Configuration file##

Study the following `config.json` file:

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

## Masks

**html-differ** supports handling of _masks_ in HTML.

For example, the following two code samples will be considered to be equivalent:

```html
<div id="{{[a-z]*\s\d+}}">
```

```html
<div id="text 12345">
```

### Syntax

_Masks_ in **html-differ** have the following syntax:

```js
{{RegExp}}
```

where:

* `{{` – opening identifier of the _mask_.

* `RegExp` – regular expression for matching with the corresponding value in another HTML. The syntax is similar to regular expressions in JavaScript written in a literal notation.

* `}}` – closing identifier of the _mask_.
