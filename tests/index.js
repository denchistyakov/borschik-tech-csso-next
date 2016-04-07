'use strict';
/* eslint-env mocha */

const expect = require('chai').expect;
const Tech = require('..').Tech;

describe('css', () => {
	const baseOptions = {
		basePath: '.',
		output: {},
		techOptions: {},
		inputString: '.block { background-image: url(./a/b.gif); }',
		freeze: false,
		minimize: false
	};

	it('tech work and minify false', () => {
		const instance = new Tech(baseOptions);

		instance.process()
			.then(content => expect(content).to.equal('.block { background-image: url("a/b.gif"); }'));
	});

	it('tech work and minify true', () => {
		const opts = Object.assign(baseOptions, {minimize: true});
		const instance = new Tech(opts);

		instance.process()
			.then(content => expect(content).to.equal('.block{background-image:url(a/b.gif)}'));
	});

	it('tech work and minify false and pass debug true to csso', () => {
		const opts = Object.assign(baseOptions, {techOptions: {csso: {debug: true}}});
		const instance = new Tech(opts);

		instance.process()
			.then(() => expect(instance).to.have.deep.property('opts.techOptions.csso.debug').and.true);
	});
});

