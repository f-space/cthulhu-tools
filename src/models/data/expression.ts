import * as AST from "./ast";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export class Variable {
	public readonly key: string;

	public constructor(readonly name: string) {
		this.key = Variable.key(name);
	}

	public static parse(key: string): Variable | null {
		return /^\$[0-9a-z_]+$/.test(key) ? new Variable(key.slice(1)) : null;
	}

	public static key(name: string): string {
		return `\$${name}`;
	}

	public toString(): string {
		return this.key;
	}
}

export class Reference {
	public readonly key: string;

	public constructor(readonly id: string, readonly modifier: string | null = null, readonly scope: string | null = null) {
		this.key = Reference.key(id, modifier, scope);
	}

	public static parse(key: string): Reference | null {
		const matches = key.match(/^(?:@([0-9a-z_]+):)?([a-z_][0-9a-z_]*)(?::([0-9a-z_]+))?$/);
		if (matches !== null) {
			const [_, scope = null, id, modifier = null] = matches;
			return new Reference(id, modifier, scope);
		}
		return null;
	}

	public static key(id: string, modifier: string | null = null, scope: string | null = null): string {
		return (scope ? `@${scope}:` : "") + id + (modifier ? `:${modifier}` : "")
	}

	public set(config: Partial<Omit<Reference, 'key'>>): Reference {
		const { id = this.id, modifier = this.modifier, scope = this.scope } = config;

		return new Reference(id, modifier, scope);
	}

	public toString(): string {
		return this.key;
	}
}

function collectDependencies(ast: AST.Node): { vars: Variable[], refs: Reference[] } {
	const vars = new Map<string, Variable>();
	const refs = new Map<string, Reference>();
	const visitor = (node: AST.Node) => {
		switch (node.type) {
			case AST.NodeType.Variable:
				const variable = new Variable(node.name);
				if (!vars.has(variable.key)) vars.set(variable.key, variable);
				break;
			case AST.NodeType.Reference:
				const reference = new Reference(node.id, node.modifier, node.scope);
				if (!refs.has(reference.key)) refs.set(reference.key, reference);
				break;
		}

		node.visitChildren(visitor);
	}
	visitor(ast);

	return { vars: [...vars.values()], refs: [...refs.values()] };
}

export class Expression {
	protected constructor(readonly ast: AST.Node, readonly vars: ReadonlyArray<Variable>, readonly refs: ReadonlyArray<Reference>) { }

	public static value(value: number): Expression {
		return new Expression(new AST.Literal(value), [], []);
	}

	public static parse(source: string): Expression | null {
		try {
			const ast = AST.parse(source);
			const deps = collectDependencies(ast);
			return new Expression(ast, deps.vars, deps.refs);
		} catch {
			return null;
		}
	}

	public evaluate(values?: Map<string, any>): number | undefined {
		return (new ASTEvaluator(values)).evaluate(this.ast) as number | undefined;
	}

	public segment(): (string | Variable)[] {
		return (new ASTSegmenter()).segment(this.ast);
	}

	public toJSON(): string {
		return this.ast.toString();
	}

	public toString(): string {
		return this.ast.toString();
	}
}

abstract class ASTVisitor {
	protected visit(node: AST.Node): any {
		switch (node.type) {
			case AST.NodeType.BinaryOp:
				return this.onBinaryOperator(node);
			case AST.NodeType.UnaryOp:
				return this.onUnaryOperator(node);
			case AST.NodeType.FunctionCall:
				return this.onFunctionCall(node);
			case AST.NodeType.Literal:
				return this.onLiteral(node);
			case AST.NodeType.Template:
				return this.onTemplate(node);
			case AST.NodeType.Substitution:
				return this.onSubstitution(node);
			case AST.NodeType.Text:
				return this.onText(node);
			case AST.NodeType.Variable:
				return this.onVariable(node);
			case AST.NodeType.Reference:
				return this.onReference(node);
		}
	}

	protected abstract onBinaryOperator(node: AST.BinaryOperator): any;
	protected abstract onUnaryOperator(node: AST.UnaryOperator): any;
	protected abstract onFunctionCall(node: AST.FunctionCall): any;
	protected abstract onLiteral(node: AST.Literal): any;
	protected abstract onVariable(node: AST.Variable): any;
	protected abstract onReference(node: AST.Reference): any;
	protected abstract onTemplate(node: AST.Template): any;
	protected abstract onSubstitution(node: AST.Substitution): any;
	protected abstract onText(node: AST.Text): any;
}

class ASTEvaluator extends ASTVisitor {
	public constructor(readonly values: Map<string, number | string | undefined> = new Map()) {
		super();
	}

	public evaluate(node: AST.Node): number | string | undefined {
		return this.visit(node);
	}

	protected onBinaryOperator(node: AST.BinaryOperator): number | undefined {
		const lhs = this.visit(node.lhs);
		const rhs = this.visit(node.rhs);
		if (lhs === undefined || rhs === undefined) return undefined;

		switch (node.op) {
			case AST.BinaryOperatorType.Add: return lhs + rhs;
			case AST.BinaryOperatorType.Sub: return lhs - rhs;
			case AST.BinaryOperatorType.Mul: return lhs * rhs;
			case AST.BinaryOperatorType.Div: return lhs / rhs;
			case AST.BinaryOperatorType.Mod: return lhs % rhs;
			case AST.BinaryOperatorType.Eq: return lhs === rhs ? 1 : 0;
			case AST.BinaryOperatorType.Ne: return lhs !== rhs ? 1 : 0;
			case AST.BinaryOperatorType.Ge: return lhs >= rhs ? 1 : 0;
			case AST.BinaryOperatorType.Le: return lhs <= rhs ? 1 : 0;
			case AST.BinaryOperatorType.Gt: return lhs > rhs ? 1 : 0;
			case AST.BinaryOperatorType.Lt: return lhs < rhs ? 1 : 0;
		}
	}

	protected onUnaryOperator(node: AST.UnaryOperator): number | undefined {
		const expression = this.visit(node.expression);
		if (expression === undefined) return undefined;

		switch (node.op) {
			case AST.UnaryOperatorType.Pos: return +expression;
			case AST.UnaryOperatorType.Neg: return -expression;
		}
	}

	protected onFunctionCall(node: AST.FunctionCall): number | string | undefined {
		const args = node.args.map(x => this.visit(x));
		if (args.some(arg => arg === undefined)) return undefined;

		switch (node.fn) {
			case 'if': return args[0] ? args[1] : args[2];
			case 'and': return (args[0] && args[1]) ? 1 : 0;
			case 'or': return (args[0] || args[1]) ? 1 : 0;
			case 'not': return !args[0] ? 1 : 0;
			case 'floor': return Math.floor(args[0]);
			case 'ceil': return Math.ceil(args[0]);
			case 'round': return Math.round(args[0]);
			default: return undefined;
		}
	}

	protected onLiteral(node: AST.Literal): number {
		return node.value;
	}

	protected onTemplate(node: AST.Template): string | undefined {
		const segments = node.segments.map(x => this.visit(x));
		if (segments.some(seg => seg === undefined)) return undefined;

		return segments.join("");
	}

	protected onSubstitution(node: AST.Substitution): string | undefined {
		const expression = this.visit(node.expression);
		if (expression === undefined) return undefined;

		return String(expression);
	}

	protected onText(node: AST.Text): string {
		return node.value;
	}

	protected onVariable(node: AST.Variable): number | string | undefined {
		return this.values.get(Variable.key(node.name));
	}

	protected onReference(node: AST.Reference): number | string | undefined {
		return this.values.get(Reference.key(node.id, node.modifier, node.scope));
	}
}

class ASTSegmenter extends ASTVisitor {
	public segment(node: AST.Node): (string | Variable)[] {
		function* flatten(segments: any[]): IterableIterator<string | Variable> {
			for (const segment of segments) {
				if (Array.isArray(segment)) {
					yield* flatten(segment);
				} else {
					yield segment;
				}
			}
		}

		function* join(segments: IterableIterator<string | Variable>) {
			let chunk = [];
			for (const segment of segments) {
				if (typeof segment === 'string') {
					chunk.push(segment);
				} else {
					if (chunk.length > 0) yield chunk.join("");
					yield segment;
					chunk = [];
				}
			}
			if (chunk.length > 0) yield chunk.join("");
		}

		return Array.from(join(flatten(this.visit(node))));
	}

	protected onBinaryOperator(node: AST.BinaryOperator): any[] {
		const lhs = this.visit(node.lhs);
		const rhs = this.visit(node.rhs);
		const lhsSeg = node.priority < node.lhs.priority ? ["(", lhs, ")"] : lhs;
		const rhsSeg = node.priority > node.rhs.priority ? rhs : ["(", rhs, ")"];
		return [lhsSeg, " ", node.op, " ", rhsSeg];
	}

	protected onUnaryOperator(node: AST.UnaryOperator): any[] {
		const expression = this.visit(node.expression);
		const exprSeg = node.priority < node.expression.priority ? ["(", expression, ")"] : expression;
		return [node.op, exprSeg];
	}

	protected onFunctionCall(node: AST.FunctionCall): any[] {
		const args = node.args.map(x => this.visit(x));
		const argsSeg = args.slice(0, 1).concat(args.slice(1).map(arg => [", ", arg]));
		return [node.fn, "(", argsSeg, ")"];
	}

	protected onLiteral(node: AST.Literal): any[] {
		return [String(node)];
	}

	protected onTemplate(node: AST.Template): any[] {
		const segments = node.segments.map(x => this.visit(x));

		return segments;
	}

	protected onSubstitution(node: AST.Substitution): any[] {
		const expression = this.visit(node.expression);

		return expression;
	}

	protected onText(node: AST.Text): any[] {
		return [String(node)];
	}

	protected onVariable(node: AST.Variable): any[] {
		return [new Variable(node.name)];
	}

	protected onReference(node: AST.Reference): any[] {
		return [String(node)];
	}
}