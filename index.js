'use strict';

var cssbase = require('borschik/lib/techs/css');
var csso = require('csso');

exports.Tech = cssbase.Tech.inherit({
	minimize: function borschikCssoNextMinimize(content) {
		var opts = this.opts.techOptions && this.opts.techOptions.csso || {};

		return csso.minify(content, opts).css;
	}
});
