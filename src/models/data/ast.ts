import * as pegjs from "pegjs/expression";

export enum NodeType {
	BinaryOp = 'binary-op',
	UnaryOp = 'unary-op',
	FunctionCall = 'func-call',
	Literal = 'literal',
	Template = 'template',
	Substitution = 'substitution',
	Text = 'text',
	Variable = 'variable',
	Reference = 'reference',
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
	| Variable
	| Literal
	| Template
	| Substitution
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

export class Template implements NodeInterface {
	public get type(): NodeType.Template { return NodeType.Template; }
	public get priority(): number { return PriorityLevel.String; }

	public constructor(readonly segments: ReadonlyArray<Node>) { }

	public visitChildren(visitor: (node: Node) => void): void {
		this.segments.forEach(x => visitor(x));
	}

	public replaceChildren(visitor: (node: Node) => Node): Template {
		const segments = this.segments.map(x => visitor(x));

		return segments.every((x, i) => x === this.segments[i]) ? this : new Template(segments);
	}

	public toString(): string {
		return `"${this.segments.join("")}"`;
	}
}

export class Substitution implements NodeInterface {
	public get type(): NodeType.Substitution { return NodeType.Substitution; }
	public get priority(): number { return PriorityLevel.String; }

	public constructor(readonly expression: Node) { }

	public visitChildren(visitor: (node: Node) => void): void {
		visitor(this.expression);
	}

	public replaceChildren(visitor: (node: Node) => Node): Substitution {
		const expression = visitor(this.expression);

		return (expression === this.expression) ? this : new Substitution(expression);
	}

	public toString(): string {
		return `{${this.expression}}`;
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
		return this.value.replace(/[`{}\\]/g, "\\$&");
	}
}

export class Variable implements NodeInterface {
	public get type(): NodeType.Variable { return NodeType.Variable; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly name: string) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): Variable {
		return this;
	}

	public toString(): string {
		return `\$${this.name}`;
	}
}

export class Reference implements NodeInterface {
	public get type(): NodeType.Reference { return NodeType.Reference; }
	public get priority(): number { return PriorityLevel.Terminal; }

	public constructor(readonly id: string, readonly modifier: string | null = null, readonly scope: string | null = null) { }

	public visitChildren(visitor: (node: Node) => void): void { }

	public replaceChildren(visitor: (node: never) => any): Reference {
		return this;
	}

	public toString(): string {
		return (this.scope ? `@${this.scope}:` : "") + this.id + (this.modifier ? `:${this.modifier}` : "");
	}
}

export function parse(source: string): Node {
	return walk(pegjs.parse(source));
}

function walk(node: any): Node {
	switch (node.type) {
		case NodeType.BinaryOp: return new BinaryOperator(node.op, walk(node.lhs), walk(node.rhs));
		case NodeType.UnaryOp: return new UnaryOperator(node.op, walk(node.expr));
		case NodeType.FunctionCall: return new FunctionCall(node.fn, node.args.map((x: any) => walk(x)))
		case NodeType.Literal: return new Literal(node.value);
		case NodeType.Template: return new Template(node.segments.map((x: any) => walk(x)));
		case NodeType.Substitution: return new Substitution(walk(node.expr));
		case NodeType.Text: return new Text(node.value);
		case NodeType.Variable: return new Variable(node.name);
		case NodeType.Reference: return new Reference(node.id, node.modifier, node.scope);
		default: throw new Error('unreachable code');
	}
}