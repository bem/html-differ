# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ)

Сompares two ```html-files```.

## The comparison algorithm

```html-differ``` compares files on the following criteria:

1. Two respective attributes ```class``` are considered to be equal if they refer on same groups of ```CSS-styles```
2. Two respective lists of attributes are considered to be equal even if they go in different order

This code

```html
<html>
<head>
<title>Test</title>
</head>
<body>
   <label>label for input</label>
   <input id="random" class="ab bc cd" for="blah">
</body>
</html>
```

equals to

```html
<html>
<head>
<title>Test</title>
</head>
<body>
   <label>label for input</label>
   <input class=" cd  ab bc" for="blah" id="random">
</body>
</html>
```

## Install

```bash
$ npm install html-differ
```

## Usage

###As a js-module###

####html-differ####

**html-differ.diffHtml**<br>
**@param** *String* - the 1-st ```html-code```<br>
**@param** *String* - the 2-nd ```html-code```<br>
**@param** *{Object}* - options:
* sets what respective attributes are always considered to be equal<br>
(for example, ```ignoreHtmlAttrs: ['id', 'for']```, optional parameter)
* sets what respective attributes' content will be compared as ```JSONs```, not as ```strings```<br>
(for example, ```compareHtmlAttrsAsJSON: ['data-bem']```, optional parameter)

**@returns** *{Object}* - see [here](https://github.com/kpdecker/jsdiff#examples).

**html-differ.isEqual**<br>
This method has the same parameters as the previous one, but returns ```Boolean```.

####diff-logger####

**diff-logger.log**<br>
Pretty logging of diffs. Red text should be removed from the first html relative to the second one, green text should be added.<br>
**@param** *{Object}* - the result of the work of the method ```html-differ.diffHtml```<br>
**@param** *{Object}* - options:<br>
* the number of characters, which will be logged before the diff and after it<br>
(for example, ```showCharacters: 20```, default - ```20```, optional parameter)

####For BEM####

**html-differ.bemDiff**<br>
This method does ```diff + log```.<br>
The options are predefined:
* ```ignoreHtmlAttrs: ['id', 'for']```<br>
* ```compareHtmlAttrsAsJSON: ['data-bem']```<br>
* ```showCharacters: 20```

**@param** *String* - the 1-st ```html-code```<br>
**@param** *String* - the 2-nd ```html-code```

####Example####

```js
var fs = require('fs'),
    htmlDiffer = require('html-differ'),
    diffLogger = require('html-differ/lib/diff-logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var res = htmlDiffer.isEqual(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } );

// common case
diffLogger.log(htmlDiffer.diffHtml(html1, html2, { ignoreHtmlAttrs: ['id' , 'for'], compareHtmlAttrsAsJSON: ['data-bem'] }), { showCharacters: 20 });

// for BEM (you can not set options)
htmlDiffer.bemDiff(html1, html2);
```

###As a program###

Go to the root folder:

```bash
$ cd html-differ
```

To run as a program use ```bin/html-differ```.

```bash
$ bin/html-differ --help
Compares two html-files
Red text should be removed from the first html relative to the second one, green text should be added

Usage:
  html-differ [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  --config=CONFIG : Path to configuration JSON-file

Arguments:
  PATH1 : Path to the 1-st html-file (required)
  PATH2 : Path to the 2-nd html-file (required)
```

####Example####

```bash
$ bin/html-differ path/to/html1 path/to/html2

$ bin/html-differ --config=path/to/config path/to/html1 path/to/html2
```

####Configuration file###

Study the following ```config.json```:

```js
{
    "ignoreHtmlAttrs": ["id", "for"],
    "compareHtmlAttrsAsJSON": ["data-bem"],
    "showCharacters": 20
}
```

* ```ignoreHtmlAttrs: [ Array ]``` - sets what respective attributes are always considered to be equal

* ```compareHtmlAttrsAsJSON: [ Array ]``` - sets what respective attributes' content will be compared as ```JSONs```, not as ```strings```

* ```showCharacters: Number``` - the number of characters, which will be logged before the diff and after it

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
