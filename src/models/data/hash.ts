import toSHA256 from "fast-sha256";
import { encode } from "@stablelib/utf8";

export function sha256(data: string): string {
	return toHexString(toSHA256(encode(data)));
}

function toHexString(bytes: Uint8Array): string {
	return Array.from(bytes).map(x => x.toString(16).padStart(2, "0")).join('');
}