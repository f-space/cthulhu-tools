declare module "*.pugx" {
	import { ComponentType } from 'react';
	const Component: ComponentType;
	export default Component;
}

declare module "*.scss" {
	const styles: { [key: string]: string };
	export default styles;
}

declare module "@resource/*" {
	const url: string;
	export default url;
}