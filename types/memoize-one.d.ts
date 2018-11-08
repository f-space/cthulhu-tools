declare module 'memoize-one' {
	export interface EqualityFn {
		(a: any, b: any): boolean;
	}

	export default function <T extends Function>(resultFn: T, isEqual?: EqualityFn): T;
}