# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ)

Сompares two `HTML` codes.

## The comparison algorithm

`HTML` codes are compared as **browsers** do, to be more exact `html-differ` compares `HTML` codes using the following criteria:

* Two respective lists of attributes are considered to be equivalent even if they are specified in different order.

For example, the following two code samples will be considered to be equivalent:

```html
<span id="blah" class="ololo" tabIndex="1">Text</span>
```

```html
<span tabIndex="1" id="blah" class="ololo">Text</span>
```

* Two respective attributes `class` are considered to be equivalent if they refer to the same groups of `CSS` styles.

For example, the following two code samples will be considered to be equivalent:

```html
<span class="ab bc cd">Text</span>
```

```html
<span class=" cd  ab bc">Text</span>
```

* From the list of the same tag's attributes, the attrubute which goes the first will be taken for comparison, others will be ignored.

For example, the following two code samples will be considered to be equivalent:

```html
<span id="blah" id="ololo">Text</span>
```

```html
<span id="blah">Text</span>
```

* Closing tags are not compared.

For example, the following two code samples will be considered to be equivalent:

```html
<span>Text</span>
```

```html
<span>Text</spane>
```

**CAUTION!** `html-differ` does not check the validity of `HTML` codes, but compares them using the above shown criteria and specified options (see the list of possible options in the [usage](https://github.com/bem/html-differ#usage)).

## Install

```bash
$ npm install html-differ -g
```

## Usage

###As a js-module###

####html-differ####

**html-differ.diffHtml**<br>
**@param** *{String}* - the 1-st `HTML` code<br>
**@param** *{String}* - the 2-nd `HTML` code<br>
**@returns** *{Array of objects}* - [array with diffs](https://github.com/kpdecker/jsdiff#change-objects) between `HTML` codes

**html-differ.isEqual**<br>
**@param** *{String}* - the 1-st `HTML` code<br>
**@param** *{String}* - the 2-nd `HTML` code<br>
**@returns** *{Boolean}*

####diff-logger####

**diff-logger.getDiffText**<br>
**@param** *{Array of objects}* - the result of the work of the method `html-differ.diffHtml`<br>
**@param** *{Object}* - options:<br>

* `charsAroundDiff: Number` - the number of characters around the diff result between two `HTML` codes (default: `40`).

**@returns** *{String}* - diffs

**diff-logger.log**<br>
**@param** *{Array of objects}* - the result of the work of the method `html-differ.diffHtml`<br>
**@param** *{Object}* - options:<br>

* `charsAroundDiff: Number` - the number of characters around the diff result between two `HTML` codes (default: `40`).

**@returns** - pretty logging of diffs:

<img src='https://cloud.githubusercontent.com/assets/6376693/3648928/a6b9d48a-110d-11e4-8a07-d9b156145017.png'/>


**Example**

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

Where `options` is the `Object`:

* **ignoreHtmlAttrs: [ Array ]**

Sets what kind of respective attributes' content will be ignored during the comparison (default: `[]`).

**Example**: `['id', 'for']`<br>
The following two code samples will be considered to be equivalent:

```html
<label for="random">label for input</label>
<input id="random">
```

```html
<label for="sfsdfksdf">label for input</label>
<input id="sfsdfksdf">
```

* **compareHtmlAttrsAsJSON: [ Array ]**

Sets what kind of respective attributes' content will be compared as `JSON` objects, but not as strings (default: `[]`).

**Example**: `['onclick']`<br>
The following two code samples will be considered to be equivalent:

```html
<div onclick='return {"bla":{"first":"ololo","second":"trololo"}}'></div>
```

```html
<div onclick='return {"bla":{"second":"trololo","first":"ololo"}}'></div>
```

* **ignoreWhitespaces: Boolean**

Makes `html-differ` ignore whitespaces (spaces, tabs, new lines etc.) during the comparison (default: `true`).

**Example**: `true`<br>
The following two code samples will be considered to be equivalent:

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

Makes `html-differ` ignore `HTML` comments during the comparison (default: `true`).

**Example**: `true`<br>
The following two code samples will be considered to be equivalent:

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

Sets predefined options for `BEM` (default: `false`).

**Example**: `true`

* `ignoreHtmlAttrs: ['id', 'for']`
* `compareHtmlAttrsAsJSON: ['data-bem', 'onclick', 'ondblclick']`


###As a program###

```bash
$ html-differ --help
Compares two HTML codes

Usage:
  html-differ [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  --config=CONFIG : Path to configuration JSON file
  --chars-around-diff=CHARSAROUNDDIFF : The number of characters around the diff (default: 40)

Arguments:
  PATH1 : Path to the 1-st HTML file (required)
  PATH2 : Path to the 2-nd HTML file (required)
```

**Example**

```bash
$ bin/html-differ path/to/html1 path/to/html2

$ bin/html-differ --config=path/to/config --chars-around-diff=40 path/to/html1 path/to/html2
```

####Configuration file###

Look at the following `config.json` file:

```js
{
    "ignoreHtmlAttrs": [],
    "compareHtmlAttrsAsJSON": [],
    "ignoreWhitespaces": true,
    "ignoreHtmlComments": true,
    "bem": false
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
