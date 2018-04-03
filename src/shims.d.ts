declare module "*.jsx.pug" {
	import { ComponentType } from 'react';
	const Component: ComponentType;
	export default Component;
}

declare module "*.scss" {
	const styles: { [key: string]: string };
	export default styles;
}

declare module "*.png" {
	const url: string;
	export default url;
}

declare module "*.wav" {
	const url: string;
	export default url;
}

declare module "*.json" {
	const url: string;
	export default url;
}