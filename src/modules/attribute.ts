import Vue from 'vue';
import { AttributeData, Attribute, AttributeProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";
import BUILTIN_ATTRIBUTES_URL from "@resource/data/attributes.json";

type AttributeTable = { [uuid: string]: Attribute };

@Module({ namespaced: true })
export default class AttributeModule implements AttributeProvider {
	public attributes: AttributeTable = Object.create(null);

	@Getter
	public get provider(): AttributeProvider { return this; }

	@Mutation
	public set_attribute(attribute: Attribute): void {
		Vue.set(this.attributes, attribute.uuid, attribute);
	}

	@Mutation
	public delete_attribute(uuid: string): void {
		Vue.delete(this.attributes, uuid);
	}

	@Action
	public async create(attribute: Attribute): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.add(attribute.toJSON());
		}).then(() => {
			this.set_attribute(attribute);
		});
	}

	@Action
	public async update(attribute: Attribute): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.update(attribute.uuid, attribute.toJSON());
		}).then(() => {
			this.set_attribute(attribute);
		});
	}

	@Action
	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.attributes, () => {
			return DB.attributes.delete(uuid);
		}).then(() => {
			this.delete_attribute(uuid);
		});
	}

	@Action
	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.attributes, () => {
			return DB.attributes.toArray();
		}).then(attributes => {
			for (const attribute of attributes) {
				this.set_attribute(Attribute.from(attribute));
			}
		});
	}

	@Action
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
				this.set_attribute(Attribute.from(attribute, true));
			}
		});
	}

	public get(uuid: string): Attribute | undefined;
	public get(uuids: string[]): Attribute[];
	public get(uuids: string | string[]): Attribute | Attribute[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.attributes[uuid]).filter(x => x !== undefined)
			: this.attributes[uuids];
	}

	public list() { return Object.values(this.attributes); }
}