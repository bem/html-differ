# html-differ [![Build Status](https://travis-ci.org/bem/html-differ.svg)](https://travis-ci.org/bem/html-differ) [![Coverage Status](https://img.shields.io/coveralls/bem/html-differ.svg)](https://coveralls.io/r/bem/html-differ?branch=master) [![Dependency Status](https://david-dm.org/bem/html-differ.svg)](https://david-dm.org/bem/html-differ)

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
$ npm install html-differ -g
```

## Usage

###As a js-module###

####html-differ####

**html-differ.diffHtml**<br>
**@param** *String* - the 1-st ```html-code```<br>
**@param** *String* - the 2-nd ```html-code```<br>
**@returns** *{Array of objects}* - see [here](https://github.com/kpdecker/jsdiff#change-objects)

**html-differ.isEqual**<br>
This method has the same parameters as the previous one, but returns ```Boolean```.

####diff-logger####

**diff-logger.getDiffText**<br>
**@param** *{Object}* - the result of the work of the method ```html-differ.diffHtml```<br>
**@param** *{Object}* - options:<br>
* the number of characters before the diff and after it<br>
(for example, ```charsAroundDiff: 40```, default: ```40```)<br>

**@returns** *{String}* - diffs

**diff-logger.log**<br>
Pretty logging of diffs.<br>
This method has the same parameters as the previous one.

####Example####

```js
var fs = require('fs'),
    HtmlDiffer = require('html-differ').HtmlDiffer,
    diffLogger = require('html-differ/lib/diff-logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var options = {
    ignoreHtmlAttrs: [],
    compareHtmlAttrsAsJSON: [],
    verbose: true,
    ignoreWhitespace: true,
    bem: false
}

var htmlDiffer = new HtmlDiffer(options);

var diff = htmlDiffer.diffHtml(html1, html2);

var isEqual = htmlDiffer.isEqual(html1, html2);

var res = diffLogger.getDiffText(diff, { charsAroundDiff: 40 });

diffLogger.log(diff, { charsAroundDiff: 40 });
```

where ```options``` is the ```Object```:

* ```ignoreHtmlAttrs: [ Array ]``` - sets what respective attributes are always considered to be equal

* ```compareHtmlAttrsAsJSON: [ Array ]``` - sets what respective attributes' content will be compared as ```JSONs```, not as ```Strings```

* ```verbose: Boolean``` - see [here](https://github.com/tautologistics/node-htmlparser#option-verbose)

* ```ignoreWhitespace: Boolean``` - see [here](https://github.com/tautologistics/node-htmlparser#option-ignorewhitespace)

* ```bem: Boolean``` - predefined options for BEM


####For BEM####
Options for BEM are predefined:
* ```ignoreHtmlAttrs: ['id', 'for']```

* ```compareHtmlAttrsAsJSON: ['data-bem', 'onclick', 'ondblclick']```

* ```verbose: true```

* ```ignoreWhitespace: true```

* ```charsAroundDiff: 40```


###As a program###

```bash
$ html-differ --help
Compares two html-files

Usage:
  html-differ [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  --config=CONFIG : Path to configuration JSON-file
  --chars-around-diff=CHARSAROUNDDIFF : The number of characters around the diff

Arguments:
  PATH1 : Path to the 1-st html-file (required)
  PATH2 : Path to the 2-nd html-file (required)
```

####Example####

```bash
$ bin/html-differ path/to/html1 path/to/html2

$ bin/html-differ --config=path/to/config path/to/html1 path/to/html2 --chars-around-diff=40
```

####Configuration file###

Study the following ```config.json```:

```js
{
    "ignoreHtmlAttrs": [],
    "compareHtmlAttrsAsJSON": [],
    "verbose": true,
    "ignoreWhitespace": true,
    "bem": false
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
