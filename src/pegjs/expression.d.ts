export interface Parser {
	parse(text: string, options?: ParserOptions): any;
}

export interface ParserOptions {
	startRule?: string;
	tracer?: any;
}

declare const parser: Parser;
export default parser;