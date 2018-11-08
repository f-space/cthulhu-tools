const fs = require('fs');
const checker = require('license-checker');

const PACKAGE_PATH = "package.json";
const OUTPUT = "libraries.json";

const COPYRIGHT_NOTICE = /^\s*Copyright\s*(.+)\s*$/m;
const COPYRIGHT_SYMBOL = /(?:©|\(c\)),?/;
const COPYRIGHT_YEARS = /(?:\d{4}(?:.(?:\d{4}|present))?,?\s*)+/;
const COPYRIGHT_EMAIL = /(?:[\s<(]|&lt;|^)[\w\.]+@[\w\.]+(?:[\s>)]|&gt;|$)/;
const COPYRIGHT_URL = /[<(]?(?:https?:\/\/)[\w\.]+[>)]?|[<(][\w\.]+\.(?:com|net)[>)]/;
const COPYRIGHT_NOTE = /All\s+rights\s+reserved\.?/i;
const COPYRIGHT_EXTRAS = [
	COPYRIGHT_SYMBOL,
	COPYRIGHT_YEARS,
	COPYRIGHT_EMAIL,
	COPYRIGHT_URL,
	COPYRIGHT_NOTE,
];

const MARKDOWN_LINK = () => /\[(.+?)\]\(.+?\)|<(.+?)>/g;

const KNOWN_PACKAGES = {
	"@fortawesome/fontawesome-common-types": {
		owner: "Fonticons, Inc.",
	},
	"@fortawesome/fontawesome-svg-core": {
		owner: "Fonticons, Inc.",
	},
	"@fortawesome/free-solid-svg-icons": {
		owner: "Fonticons, Inc.",
	},
	"array-buffer-from-string": {
		owner: "Linus Unnebäck",
	},
	"dexie": {
		owner: "David Fahlander",
	},
	"fmix": {
		owner: "Linus Unnebäck",
	},
	"humps": {
		owner: "Dom Christie",
	},
	"murmur-128": {
		owner: "Linus Unnebäck",
	},
	"react-router-dom": {
		owner: "React Training",
	},
	"react-router": {
		owner: "React Training",
	},
	"regenerator-runtime": {
		owner: "Facebook, Inc.",
	},
	"resolve-pathname": {
		owner: "Michael Jackson",
	},
	"value-equal": {
		owner: "Michael Jackson",
	},
};

fs.readFile(PACKAGE_PATH, { encoding: 'utf8' }, (err, data) => {
	if (err) throw err;

	const self = JSON.parse(data).name;

	checker.init({
		start: ".",
		production: true,
	}, (err, packages) => {
		if (err) throw err;

		const list = [];
		for (const [key, value] of Object.entries(packages)) {
			const name = key.slice(0, key.lastIndexOf("@"));
			const version = key.slice(name.length + 1);
			if (name !== self) {
				const { licenses, licenseFile } = value;
				const known = KNOWN_PACKAGES[name] || {};
				const owner = known.owner || inferOwner(name, licenseFile);

				list.push({ name, version, owner, licenses });
			}
		}

		const result = distinct(list);

		fs.writeFile(OUTPUT, JSON.stringify(result, undefined, "\t"), err => {
			if (err) throw err;
		});
	});
});

function inferOwner(name, file) {
	const text = fs.readFileSync(file, { encoding: 'utf8' });
	const match = text.match(COPYRIGHT_NOTICE);
	if (!match) throw new Error(`Copyright notice not found: ${name}\n${text}`);

	const line = match[1];
	const noLinks = line.replace(MARKDOWN_LINK(), "$1$2");
	const noExtras = COPYRIGHT_EXTRAS.reduce((s, re) => s.replace(re, ""), noLinks);
	const trimed = noExtras.trim();
	const noTrailingCommas = trimed.endsWith(",") ? trimed.slice(0, -1) : trimed;
	const noTrailingDots = noTrailingCommas.match(/\w{5,}\.$/) ? noTrailingCommas.slice(0, -1) : noTrailingCommas;

	return noTrailingDots;
}

function distinct(list) {
	const map = new Map();
	for (const entry of list) {
		const infoKey = String([entry.owner, entry.licenses]);
		const infoMap = map.get(entry.name) || new Map();
		infoMap.set(infoKey, entry);
		map.set(entry.name, infoMap);
	}

	const result = [];
	for (const infoMap of map.values()) {
		if (infoMap.size > 1) {
			const entries = [...infoMap.values()];
			entries.sort((x, y) => String.prototype.localeCompare.call(x.version, y.version));
			for (const { name, version, owner, licenses } of entries.slice(0, -1)) {
				result.push({ name: `${name}@${version}`, owner, licenses });
			}
			{
				const { name, owner, licenses } = entries[entries.length - 1];
				result.push({ name, owner, licenses });
			}
		} else {
			for (const { name, owner, licenses } of infoMap.values()) {
				result.push({ name, owner, licenses });
			}
		}
	}

	return result;
}
