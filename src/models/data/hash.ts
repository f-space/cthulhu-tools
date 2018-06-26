import murmur128 from "murmur-128";

export class Hash {
	private constructor(readonly buffer: ArrayBuffer) { }

	public static from(data: ArrayBuffer | string): Hash {
		return new Hash(murmur128(data));
	}

	public bytes(): Uint8Array {
		return new Uint8Array(this.buffer);
	}

	public hex(): string {
		return Array.from(this.bytes()).map(x => x.toString(16).padStart(2, "0")).join('');
	}
}