import { AttributeData, Attribute } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setAttribute, deleteAttribute } from "redux/actions/attribute";
import BUILTIN_ATTRIBUTES_URL from "@resource/data/attributes.json";

export default class AttributeCommand {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(attribute: Attribute): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.add(attribute.toJSON());
		}).then(() => {
			this.dispatch(setAttribute(attribute));
		});
	}

	public async update(attribute: Attribute): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.update(attribute.uuid, attribute.toJSON());
		}).then(() => {
			this.dispatch(setAttribute(attribute));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.delete(uuid);
		}).then(() => {
			this.dispatch(deleteAttribute(uuid));
		});
	}

	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.attributes, () => {
			return DB.attributes.toArray();
		}).then(attributes => {
			for (const attribute of attributes) {
				this.dispatch(setAttribute(Attribute.from(attribute)));
			}
		});
	}

	public async loadBuiltins(url: string = BUILTIN_ATTRIBUTES_URL): Promise<void> {
		await fetch(url).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(`${response.statusText}: ${url}`);
			}
		}).then(data => {
			const attributes = (Array.isArray(data) ? data : [data]) as AttributeData[];
			for (const attribute of attributes) {
				this.dispatch(setAttribute(Attribute.from(attribute, true)));
			}
		});
	}
}