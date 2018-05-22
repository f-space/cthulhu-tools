import parser from "pegjs/expression";

export enum ParseContext {
	Expression,
	Format,
}

export enum NodeType {
	BinaryOp = 'binary-op',
	UnaryOp = 'unary-op',
	FunctionCall = 'func-call',
	Literal = 'literal',
	InputVariable = 'input-var',
	Reference = 'reference',
	Format = 'format',
	Interpolation = 'interpolation',
	Text = 'text',
}

export enum BinaryOperatorType {
	Add = '+',
	Sub = '-',
	Mul = '*',
	Div = '/',
	Mod = '%',
	Eq = '==',
	Ne = '!=',
	Ge = '>=',
	Le = '<=',
	Gt = '>',
	Lt = '<',
}

export enum UnaryOperatorType {
	Pos = '+',
	Neg = '-',
}

export enum PriorityLevel {
	Terminal,
	FunctionCall,
	UnaryOp,
	MultiplicativeOp,
	AdditiveOp,
	ComparativeOp,
	String,
}

export type Node =
	| BinaryOperator
	| UnaryOperator
	| FunctionCall
	| Reference
	| InputVariable
	| Literal
	| Format
	| Interpolation
	| Text

interface NodeInterface {
	readonly type: NodeType;
	readonly priority: number;
	visitChildren(visitor: (node: Node) => void): void;
	replaceChildren(visitor: (node: Node) => Node): Node;
}

const BinaryOperatorPriorityTable = {
	'+': PriorityLevel.AdditiveOp,
	'-': PriorityLevel.AdditiveOp,
	'*': PriorityLevel.MultiplicativeOp,
	'/': PriorityLevel.MultiplicativeOp,
	'%': PriorityLevel.MultiplicativeOp,
	'==': PriorityLevel.ComparativeOp,
	'!=': PriorityLevel.ComparativeOp,
	'>=': PriorityLevel.ComparativeOp,
	'<=': PriorityLevel.ComparativeOp,
	'>': PriorityLevel.ComparativeOp,
	'<': PriorityLevel.ComparativeOp,
};

export class BinaryOperator implements NodeInterface {
	public get type(): NodeType.BinaryOp { return NodeType.BinaryOp; }
	public get priority(): number { return BinaryOperatorPriorityTable[this.op]; }

	public constructor(readonly op: BinaryOperatorType, readonly lhs: Node, readonly rhs: Node) { }

	public visitChildren(visitor: (node: Node) => void): void {
		visitor(this.lhs)
		visitor(this.rhs)
	}

	public replaceChildren(visitor: (node: Node) => Node): BinaryOperator {
		const lhs = visitor(this.lhs);
		const rhs = visitor(this.rhs);
		return (lhs === this.lhs && rhs === this.rhs) ? this : new BinaryOperator(this.op, lhs, rhs);
	}

	public toString(): string {
		const lhs = this.priority < this.lhs.priority ? `(${this.lhs})` : String(this.lhs);
		const rhs = this.priority > this.rhs.priority ? String(this.rhs) : `(${this.rhs})`;
		return `${lhs} ${this.op} ${rhs}`;
	}
}

export class UnaryOperator implements NodeInterface {
	public get type(): NodeType.UnaryOp { return NodeType.UnaryOp; }
	public get priority(): number { return PriorityLevel.UnaryOp; }

	public constructor(readonly op: UnaryOperatorType, readonly expression: Node) { }

	public visitChildren(visitor: (node: Node) => void): void {
		visitor(this.expression);
	}

	public replaceChildren(visitor: (node: Node) => Node): UnaryOperator {
		const expression = visitor(this.expression);

		return (expression === this.expression) ? this : new UnaryOperator(this.op, expression);
	}

	public toString(): string {
		const expression = this.priority < this.expression.priority ? `(${this.expression})` : String(this.expression);

		return `${this.op}${expression}`;
	}
}

export class FunctionCall implements NodeInterface {
	public get type(): NodeType.FunctionCall { return NodeType.FunctionCall; }
	public get priority(): number { return PriorityLevel.FunctionCall; }

	public constructor(readonly fn: string, readonly args: ReadonlyArray<Node>) { }

	public visitChildren(visitor: (node: Node) => void): void {
		this.args.forEach(x => visitor(x));
	}

	public replaceChildren(visitor: (node: Node) => Node): FunctionCall {
		const args = this.args.map(x => visitor(x));

		return args.every((x, i) => x === this.args[i]) ? this : new FunctionCall(this.fn, args);
	}

	public toString(): string {
		return `${this.fn}(${this.args.join(", ")})`;
	}
}

export class Literal implements NodeInterface {
	public get type(): NodeType.Literal { return NodeType.Literal; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly value: number) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): Literal {
		return this;
	}

	public toString(): string {
		return String(this.value);
	}
}

export class InputVariable implements NodeInterface {
	public get type(): NodeType.InputVariable { return NodeType.InputVariable; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly name: string) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): InputVariable {
		return this;
	}

	public toString(): string {
		return `\$${this.name}`;
	}
}

export class Reference implements NodeInterface {
	public get type(): NodeType.Reference { return NodeType.Reference; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly id: string, readonly modifier: string | null = null) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): Reference {
		return this;
	}

	public toString(): string {
		return this.id + (this.modifier ? `:${this.modifier}` : "");
	}
}

export class Format implements NodeInterface {
	public get type(): NodeType.Format { return NodeType.Format; }
	public get priority(): number { return PriorityLevel.String; }

	public constructor(readonly segments: ReadonlyArray<Node>) { }

	public visitChildren(visitor: (node: Node) => void): void {
		this.segments.forEach(x => visitor(x));
	}

	public replaceChildren(visitor: (node: Node) => Node): Format {
		const segments = this.segments.map(x => visitor(x));

		return segments.every((x, i) => x === this.segments[i]) ? this : new Format(segments);
	}

	public toString(): string {
		return this.segments.join("");
	}
}

export class Interpolation implements NodeInterface {
	public get type(): NodeType.Interpolation { return NodeType.Interpolation; }
	public get priority(): number { return PriorityLevel.String; }

	public constructor(readonly expression: Node) { }

	public visitChildren(visitor: (node: Node) => void): void {
		visitor(this.expression);
	}

	public replaceChildren(visitor: (node: Node) => Node): Interpolation {
		const expression = visitor(this.expression);

		return (expression === this.expression) ? this : new Interpolation(expression);
	}

	public toString(): string {
		return `\${${this.expression}}`;
	}
}

export class Text implements NodeInterface {
	public get type(): NodeType.Text { return NodeType.Text; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly value: string) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): Text {
		return this;
	}

	public toString(): string {
		return this.value;
	}
}

export interface ParseResult<T extends NodeInterface> {
	root?: T;
	error: any;
}

export class Parser {
	public static parse(source: string, context: ParseContext = ParseContext.Expression): ParseResult<Node> {
		try {
			const entry = this.getEntry(context);
			const node = parser.parse(source, { startRule: entry });
			const root = this.walk(node);
			return { root, error: undefined };
		} catch (error) {
			return { error };
		}
	}

	private static getEntry(context: ParseContext): string {
		switch (context) {
			case ParseContext.Expression: return 'Expression';
			case ParseContext.Format: return 'Format';
		}
	}

	private static walk(node: any): Node {
		switch (node.type) {
			case NodeType.BinaryOp: return new BinaryOperator(node.op, this.walk(node.lhs), this.walk(node.rhs));
			case NodeType.UnaryOp: return new UnaryOperator(node.op, this.walk(node.expr));
			case NodeType.FunctionCall: return new FunctionCall(node.fn, node.args.map((x: any) => this.walk(x)))
			case NodeType.Reference: return new Reference(node.id, node.modifier);
			case NodeType.InputVariable: return new InputVariable(node.name);
			case NodeType.Literal: return new Literal(node.value);
			case NodeType.Format: return new Format(node.segments.map((x: any) => this.walk(x)));
			case NodeType.Interpolation: return new Interpolation(this.walk(node.expr));
			case NodeType.Text: return new Text(node.value);
			default: throw new Error('unreachable code');
		}
	}
}