const fs = require('fs');
const selfsigned = require('selfsigned');

const attrs = { name: 'commonName', value: 'localhost' };
const pems = selfsigned.generate(attrs, {
	keySize: 2048,
	days: 30,
	algorithm: 'sha256',
	extensions: [
		{
			name: 'keyUsage',
			keyCertSign: true,
			digitalSignature: true,
			nonRepudiation: true,
			keyEncipherment: true,
			dataEncipherment: true
		},
		{
			name: 'subjectAltName',
			altNames: [
				{
					type: 2, // DNS
					value: 'localhost'
				},
			]
		}
	]
});

if (!fs.existsSync("ssl")) fs.mkdirSync("ssl");

fs.writeFile("ssl/server.key", pems.private, { encoding: 'utf8' }, error => {
	if (error) throw error;
});

fs.writeFile("ssl/server.crt", pems.cert, { encoding: 'utf8' }, error => {
	if (error) throw error;
});