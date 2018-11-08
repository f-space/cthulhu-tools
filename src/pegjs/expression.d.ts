export function parse(text: string, options?: ParseOptions): any;

export interface ParseOptions {
	startRule?: string;
	tracer?: any;
}