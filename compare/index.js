'use strict';

const fs = require('fs');
const pjoin = require('path').join;
const Vow = require('vow');

const techRequireNames = ['borschik-tech-csso-next', 'borschik-tech-csso', 'borschik-tech-cleancss'];
const techRequirePaths = ['..', 'borschik/lib/techs/css', 'borschik-tech-cleancss'];

const cssDirPath = pjoin(__dirname, 'css');
const cssFiles = fs.readdirSync(cssDirPath);

let result = {};
Vow.all(cssFiles.map(inputCssFilename => {
	const inputCssFilepath = pjoin(cssDirPath, inputCssFilename);
	const outputCssFilepath = pjoin(cssDirPath, '_' + inputCssFilename);

	result[inputCssFilename] = {
		baseStat: fs.statSync(inputCssFilepath)
	};

	return techRequirePaths.reduce((acc, techPath, index) => {
		const baseOptions = {
			basePath: '.',
			input: inputCssFilepath,
			output: outputCssFilepath,
			techOptions: {},
			freeze: false,
			minimize: true
		};

		const Tech = require(techPath).Tech;
		const instance = new Tech(baseOptions);
		const techName = techRequireNames[index];

		result[inputCssFilename][techName] = {};
		return acc
			.then(() => {
				result[inputCssFilename][techName].start = process.hrtime();
				return instance.process();
			})
			.then(() => {
				const diff = process.hrtime(result[inputCssFilename][techName].start);
				result[inputCssFilename][techName].stat = fs.statSync(outputCssFilepath);
				result[inputCssFilename][techName].finish = process.hrtime();
				result[inputCssFilename][techName].time = ~~(diff[1] / 1e6);
				fs.unlinkSync(outputCssFilepath);
			})
			.catch(err => console.error(err.stack || err.message || err));
	}, Vow.resolve());
}))
	.then(writeResults)
	.catch(err => console.error(err));

function writeResults() {
	fs.writeFileSync(pjoin(__dirname, 'compare.md'), `
# Сравнение технологий для Борщика

## Размеры файлов в килобайтах до минификации и после
${sizeCompareTable()}

## Время минификации в милисекундах
${timeCompareTable()}
	`, 'utf-8');

	function sizeCompareTable() {
		const columns = ['', 'base'].concat(techRequireNames);
		const header = `| ${columns.join(' | ')} |
	| ${columns.map(item => Array(item.length).join('_')).join(' | ')} |`;

		const rows = [];
		Object.keys(result).forEach(key => {
			let row = [key];
			const item = result[key];

			row.push(`${item.baseStat.size / 1000}`);
			row = row.concat(techRequireNames.map(techName => `${item[techName].stat.size / 1000}`));

			rows.push(`| ${row.join(' | ')} |`);
		});

		return `${header}\n${rows.join('\n')}`;
	}

	function timeCompareTable() {
		const columns = [''].concat(techRequireNames);
		const header = `| ${columns.join(' | ')} |
	| ${columns.map(item => Array(item.length).join('_')).join(' | ')} |`;

		const rows = [];
		Object.keys(result).forEach(key => {
			let row = [key];
			const item = result[key];

			row = row.concat(techRequireNames.map(techName => `${item[techName].time}`));

			rows.push(`| ${row.join(' | ')} |`);
		});

		return `${header}\n${rows.join('\n')}`;
	}
}
