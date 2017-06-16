export function showLoadFileDialog(accept: string, multiple?: false): Promise<File>;
export function showLoadFileDialog(accept: string, multiple: true): Promise<FileList>;
export function showLoadFileDialog(accept: string, multiple?: boolean): Promise<any> {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = "file";
		input.accept = accept;
		input.addEventListener('change', () => {
			if (input.files !== null && input.files.length !== 0) {
				if (multiple) {
					resolve(input.files);
				} else {
					resolve(input.files[0]);
				}
			} else {
				reject("File(s) not selected.");
			}
		});

		if (!triggerClickEvent(input)) {
			reject(new Error("'click' event canceled."));
		}
	});
}

export function showSaveFileDialog(name: string, type: string, data: string): void {
	const a = document.createElement('a');
	a.href = URL.createObjectURL(new Blob([data], { type: type }));
	a.download = name;

	triggerClickEvent(a);
}

export function readAsText(blob: Blob, encoding?: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => { resolve(reader.result); });
		reader.addEventListener('error', () => { reject(reader.error); })
		reader.readAsText(blob, encoding);
	});
}

function triggerClickEvent(target: EventTarget): boolean {
	return target.dispatchEvent(new MouseEvent('click', {
		view: window,
		bubbles: true,
		cancelable: true,
	}))
}