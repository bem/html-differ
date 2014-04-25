# html-differ

Сompares the performance of two ```html-files``` recieved from ```bemhtml``` and ```bh``` correspondently.

## Install

```
$ git clone https://github.com/eGavr/html-differ.git

$ npm install
```

## Usage

Go to the root folder:

```
cd html-differ
```

To run as a programm use ```bin/differ-html```.

```
$ bin/differ-html --help
Compares the performance of two html-files

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

Run:

```
$ ./node_modules/.bin/mocha test
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
