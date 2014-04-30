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
**@param** *{Object}* - sets what respective attributes are always considered to be equal<br>
(for example, ```{ ignoreHtmlAttrs: ['id', 'for'] }```, optional parameter)<br>
**@returns** *{Object}* - see [here](https://github.com/kpdecker/jsdiff#examples).

**html-differ.isEqual**<br>
This method has the same parameters as the previous one, but returns ```Boolean```

####diff-logger####

**diff-logger.log**<br>
Pretty logging of diffs<br>
**@param** *{Object}* - the result of the work of the method ```html-differ.diffHtml```<br>
**@param** *Integer* - the number of characters which will be logged before the diff and after it<br>
(optional parameter, default - ```20```)<br>

####Example####

```js
var fs = require('fs'),
    htmlDiffer = require('html-differ'),
    diffLogger = require('html-differ/lib/diff-logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var res = htmlDiffer.isEqual(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } );

diffLogger.log(htmlDiffer.diffHtml(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } ), 20);
```

###As a program###

If you use ```html-differ``` as a program, it will always consider two respective attributes ```id``` and ```for``` to be equal.

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

Go to the root folder:

```bash
$ cd html-differ
```

To run as a program use ```bin/differ-html```.

```bash
$ bin/differ-html --help
Compares two html-files

Usage:
  bin/html-differ [OPTIONS] [ARGS]


Options:
  -h, --help : Help
  -v, --version : Shows the version number

Arguments:
  PATH1 : Path to the 1-st html-file
  PATH2 : Path to the 2-nd html-file
```

## Tests

In the root folder run:

```bash
$ ./node_modules/.bin/mocha test
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
