# html-differ

Сompares two ```html-files``` recieved from ```bemhtml``` and ```bh``` correspondently.

## The comparison algorithm

```html-differ``` compares files on the following criteria:

1. Two respective attributes ```id``` and ```for``` are always considered to be equal
2. Two respective attributes ```class``` are considered to be equal if they refer on same groups of ```CSS-styles```

This code

```
<html>
<head>
<title>Test</title>
</head>
<body>
   <label for="random">label for input</label>
   <input id="random" class="ab bc cd">
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
   <label for="sfsdfksdf">label for input</label>
   <input id="sfsdfksdf" class=" cd  ab bc">
</body>
</html>
```

## Install

```
$ npm install html-differ
```

**or**

Using ```git```:

```
$ git clone https://github.com/eGavr/html-differ.git

$ npm install
```

## Usage

###As a js-module###

```html-difer``` provides the method ```compare```:<br>
**@param** *String* - 1-st ```html-code```<br>
**@param** *String* - 2-st ```html-code```<br>
**@param** *Boolean* - shows diff log if ```true``` (optional parameter, default - ```false```)<br>
**@returns** *Boolean*

```
var compare = require('html-differ').compare,
    fs = require('fs');

var html1 = fs.readFileSync('1.html'),
    html2 = fs.readFileSync('2.html');

var res = compare(html1, html2, true);
```

###As a program###

Go to the root folder:

```
$ cd html-differ
```

To run as a programm use ```bin/differ-html```.

```
$ bin/differ-html --help
Compares two html files

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
