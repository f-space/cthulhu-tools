const pug = require('pug');
const typescript = require('typescript');

module.exports = function JsxPugLoader(content, map, meta) {
	this.cacheable();

	try {
		const html = pug.render(content);
		const jsx = html.replace(/class=\"(.*?[^\\])\"/g, (_, list) => {
			const props = list.split(" ").map(x => `props['${x}']`);
			const className = props.length === 1 ? props[0] : `[${props.join(", ")}].join(" ")`;
			return `className={${className}}`;
		});

		const source = `\
		import * as React from 'react';
		
		export default function(props) {
			return <React.Fragment>
				${jsx}
			</React.Fragment>
		}
		`;

		const result = typescript.transpile(source, { jsx: 'react' });

		this.callback(null, result, undefined, meta);
	} catch (e) {
		this.callback(e);
	}
}