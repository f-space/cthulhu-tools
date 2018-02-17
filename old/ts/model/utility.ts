import sha256 from "fast-sha256";
import { encode } from "@stablelib/utf8";

const UUID_VERSION_4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const UUID_REGEXP = /[xy]/g;

export function generateUUID(): string {
	return UUID_VERSION_4.replace(UUID_REGEXP, ch => {
		const random = Math.random() * 16 | 0;
		const value = (ch === 'x' ? random : (random & 0x03 | 0x08));
		return value.toString(16);
	});
}

export function toHexString(bytes: Uint8Array): string {
	return Array.from(bytes).map(x => ("00" + x.toString(16)).slice(-2)).join('');
}

export function getSHA256(data: string): string {
	return toHexString(sha256(encode(data)));
}

export function requestJSON(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		xhr.open('GET', url);
		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(new Error(xhr.statusText));
			}
		};
		xhr.onerror = () => {
			reject(new Error(xhr.statusText));
		};
		xhr.send();
	});
}