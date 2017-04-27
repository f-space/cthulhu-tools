namespace Cthulhu {
	enum Status {
		Unloaded,
		Loading,
		Loaded,
		Error,
	}

	type Slice = { x: number, y: number, w: number, h: number };
	type SliceMap = { [type: number]: { [face: number]: Slice } };

	export class DiceImage {
		public constructor(readonly element: HTMLImageElement) {
			this.loadAsync().catch(e => { this._error = e; });
		}

		public static readonly DATA_LAYOUT: string = 'layout';

		private _status: Status = Status.Unloaded;
		private _error: Error | null = null;
		private _slices: SliceMap | null = null;

		public get loading(): boolean { return this._status === Status.Loading; }
		public get loaded(): boolean { return this._status === Status.Loaded; }
		public get error(): Error | null { return this._error; }

		public blit(canvas: HTMLCanvasElement, type: DiceType, face: number): void {
			if (this.loaded && this._slices) {
				const sliceSet = this._slices[type];
				if (sliceSet) {
					const slice = sliceSet[face];
					if (slice) {
						canvas.width = slice.w;
						canvas.height = slice.h;

						const context = canvas.getContext('2d');
						if (context) {
							context.clearRect(0, 0, canvas.width, canvas.height);
							context.drawImage(this.element, slice.x, slice.y, slice.w, slice.h, 0, 0, canvas.width, canvas.height);
						}
					}
				}
			}
		}

		private async loadAsync(): Promise<void> {
			if (this._status === Status.Unloaded) {
				const url = this.element.dataset[DiceImage.DATA_LAYOUT];
				if (url) {
					this._status = Status.Loading;
					try {
						const json = await this.requestAsync(url);

						this.parseJson(json);
					} catch (e) {
						this._status = Status.Error;
						throw e;
					}
					this._status = Status.Loaded;
				}
			}
		}

		private async requestAsync(url: string): Promise<any> {
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

		private parseJson(json: any): void {
			const slices = <SliceMap>Object.create(null);
			slices[DiceType.D6] = <Slice[]>json[DiceType[DiceType.D6]];
			slices[DiceType.D10] = <Slice[]>json[DiceType[DiceType.D10]];
			slices[DiceType.D100] = <Slice[]>json[DiceType[DiceType.D100]];
			this._slices = slices;
		}
	}
}