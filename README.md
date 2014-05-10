# html-differ

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

**@returns** *{Object}* - see [here](https://github.com/kpdecker/jsdiff#examples).

**html-differ.isEqual**<br>
This method has the same parameters as the previous one, but returns ```Boolean```

####diff-logger####

**diff-logger.log**<br>
Pretty logging of diffs. Red text should be removed from the first html relative to the second one, green text should be added.<br>
**@param** *{Object}* - the result of the work of the method ```html-differ.diffHtml```<br>
**@param** *{Object}* - options:<br>
* the number of characters, which will be logged before the diff and after it<br>
(for example, ```showCharacters: 20```, default - ```20```, optional parameter)

####For BEM####

**html-differ.bemDiff**<br>
This method does ```diff + log```. The options, which are responsible for ignoring of the attributes and the number of characters, which will be logged before the diff and after it, are predefined -<br>```ignoreHtmlAttrs: ['id', 'for']``` and ```showCharacters: 20``` respectively.<br>
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
diffLogger.log(htmlDiffer.diffHtml(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] }, { showCharacters: 20 } ));

// for BEM (you can not set options)
htmlDiffer.bemDiff(html1, html2);
```

###As a program###

As a program ```html-differ``` can work in two modes:

* ```for BEM```, see [the comparison algorithm](https://github.com/eGavr/html-differ/tree/bemDiff#the-comparison-algorithm), besides, it will always consider two respective attributes ```id``` and ```for``` to be equal and ```20``` characters will be logged before the diff and after it.

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
   <input class=" cd  ab bc" for="xxxxx" id="zzzzz">
</body>
</html>
```

* ```for general html```, see [the comparison algorithm](https://github.com/eGavr/html-differ/tree/bemDiff#the-comparison-algorithm).

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
  -b, --bem : Compares two html-files in BEM mode

Arguments:
  PATH1 : Path to the 1-st html-file (required)
  PATH2 : Path to the 2-nd html-file (required)
```

####Example####

```bash
$ bin/html-differ PATH_1 PATH_2

$ bin/html-differ --bem PATH_1 PATH_2
```

## Tests

In the root folder run:

```bash
$ ./node_modules/.bin/mocha test
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
