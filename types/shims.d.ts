declare module "*.jsx.pug" {
	import { ComponentType } from 'react';
	const Component: ComponentType;
	export default Component;
}

declare module "*.scss" {
	const styles: { [key: string]: string };
	export default styles;
}

declare module "assets/*" {
	const url: string;
	export default url;
}

declare module "project/LICENSE" {
	const list: ReadonlyArray<string>;
	export default list;
}

declare module "project/assets.json" {
	const assets: ReadonlyArray<Asset>;
	export default assets;
}

declare module "project/libraries.json" {
	const libraries: ReadonlyArray<Library>;
	export default libraries;
}

interface Asset {
	name: string;
	owner: string;
	url: string;
}

interface Library {
	name: string;
	owner: string;
	licenses: string;
}