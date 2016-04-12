# Borschik CSS tech based on CSSO 2.0.0
[![NPM version](https://badge.fury.io/js/borschik-tech-csso-next.png)](http://badge.fury.io/js/borschik-tech-csso-next)
[![Dependency Status](https://david-dm.org/denchistyakov/borschik-tech-csso-next.png)](https://david-dm.org/denchistyakov§/borschik-tech-csso-next)

[CSSO (CSS Optimizer)](https://github.com/css/csso) based plugin to build CSS files with [borschik](https://github.com/bem/borschik).

## Installation
```sh
$ npm install borschik borschik-tech-csso-next
```
## Usage
```sh
$ ./node_modules/.bin/borschik -t csso-next -i test.css
```

You can send option to csso with `--tech-options`
```sh
$ ./node_modules/.bin/borschik -t csso-next -i test.css --tech-options='{"csso":{"debug":true,"sourceMap":true}}'
```
