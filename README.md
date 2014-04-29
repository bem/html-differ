# html-differ

Сompares two ```html-files```.

## The comparison algorithm

```html-differ``` compares files on the following criteria:

1. Two respective attributes ```class``` are considered to be equal if they refer on same groups of ```CSS-styles```
2. Two respective lists of attributes are considered to be equal even if they go in different order

This code

```
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

```
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

```
$ npm install html-differ
```

## Usage

###As a js-module###

####html-difer####

#####html-differ.diffHtml#####
**@param** *String* - 1-st ```html-code```<br>
**@param** *String* - 2-st ```html-code```<br>
**@param** *{Object}* - sets what respective attributes are always considered to be equal<br>
(for example, ```{ ignoreHtmlAttrs: ['id', 'for'] }```, optional parameter)<br>
**@returns** *{Object}* - see [here](https://github.com/kpdecker/jsdiff#examples).

#####html-differ.isEqual#####
This method has the same parameters as the previous one, but returns ```Boolean```

####diff-logger####

#####diff-logger.log#####
Pretty logging of diffs<br>
**@param** *{Object}* - the result of the work of the method ```diffHtml```<br>
**@param** *Integer* - the number of characters which will be logged before the diff and after it<br>

####Example####

```
var htmlDiffer = require('html-differ'),
    diffLogger = require('diff-logger');

var html1 = fs.readFileSync('1.html', 'utf-8'),
    html2 = fs.readFileSync('2.html', 'utf-8');

var res = htmlDiffer.isEqual(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } );

diffLogger.log(htmlDiffer.diffHtml(html1, html2, { ignoreHtmlAttrs: ['id', 'for'] } ));
```

###As a program###

Go to the root folder:

```
$ cd html-differ
```

To run as a programm use ```bin/differ-html```.

```
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

```
$ ./node_modules/.bin/mocha test
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
