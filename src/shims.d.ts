declare module "*.scss" {
	const styles: { [key: string]: string };
	export default styles;
}

declare module "@resource/*" {
	const url: string;
	export default url;
}