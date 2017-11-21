const fs = require('fs');
const path = require('path');
const readline = require('readline');

const COMPONENTS_PATH = "./src/components";
const VUE_TEMPLATE = `\
<template lang="pug" src="./{{name}}.pug"></template>
<script lang="ts" src="./{{name}}.ts"></script>
<style lang="scss" src="./{{name}}.scss" scoped></style>
`
const VUE_DECL_TEMPLATE = `\
export * from "./{{name}}";
export { default } from "./{{name}}";
`

async function getName() {
	if (process.argv.length > 2) {
		return process.argv[2];
	} else {
		return await new Promise((resolve, reject) => {
			const rl = readline.createInterface({ input: process.stdin, });
			process.stdout.write("Component Name: ");

			let name = '';
			rl.on('line', line => { if (name = line.trim()) rl.close(); });
			rl.on('close', () => { name ? resolve(name) : reject() });
		})
	}
}

getName().then(name => {
	const dir = path.join(COMPONENTS_PATH, name);
	if (fs.existsSync(dir)) {
		console.error(`'${name}' component already exists.`);
	} else {
		fs.mkdirSync(dir);
		fs.writeFileSync(path.join(dir, `${name}.pug`), "", { encoding: "utf8" });
		fs.writeFileSync(path.join(dir, `${name}.ts`), "", { encoding: "utf8" });
		fs.writeFileSync(path.join(dir, `${name}.scss`), "", { encoding: "utf8" });
		fs.writeFileSync(path.join(dir, `component.vue`), VUE_TEMPLATE.replace(/{{name}}/g, name), { encoding: "utf8" });
		fs.writeFileSync(path.join(dir, `component.vue.d.ts`), VUE_DECL_TEMPLATE.replace(/{{name}}/g, name), { encoding: "utf8" });
	}
});

