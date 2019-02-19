interface ResourceMap {
	json: any;
	text: string;
	arrayBuffer: ArrayBuffer;
	blob: Blob;
}

export async function load<K extends keyof ResourceMap>(url: string, type: K): Promise<ResourceMap[K]> {
	return await fetch(url).then(response => {
		if (response.ok) {
			return response[type]();
		} else {
			throw new Error(`${response.statusText}: ${url}`);
		}
	});
}

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = (e) => reject(new Error((e as ErrorEvent).message));
		image.src = src;
	});
}