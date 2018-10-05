import * as AST from "./ast";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export { AST };

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

export class Expression {
	protected constructor(readonly ast: AST.Node, readonly vars: ReadonlyArray<Variable>, readonly refs: ReadonlyArray<Reference>) { }

	public static parse(source: string): Expression | null {
		try {
			const ast = AST.parse(source);
			const deps = Expression.collectDependencies(ast);
			return new Expression(ast, deps.vars, deps.refs);
		} catch {
			return null;
		}
	}

	public evaluate(values?: Map<string, any>): any {
		return ASTEvaluator.evaluate(this.ast, values);
	}

	public toJSON(): string {
		return this.ast.toString();
	}

	public toString(): string {
		return this.ast.toString();
	}

	private static collectDependencies(ast: AST.Node): { vars: Variable[], refs: Reference[] } {
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
		};
		visitor(ast);

		return { vars: [...vars.values()], refs: [...refs.values()] };
	}
}

class ASTEvaluator {
	public constructor(readonly values: Map<string, any> = new Map()) { }

	public static evaluate(node: AST.Node, values?: Map<string, any>): any {
		const evaluator = new ASTEvaluator(values);

		return evaluator.evaluate(node);
	}

	protected evaluate(node: AST.Node): any {
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

	protected onBinaryOperator(node: AST.BinaryOperator): any {
		const lhs = this.evaluate(node.lhs);
		const rhs = this.evaluate(node.rhs);
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

	protected onUnaryOperator(node: AST.UnaryOperator): any {
		const expression = this.evaluate(node.expression);
		if (expression === undefined) return undefined;

		switch (node.op) {
			case AST.UnaryOperatorType.Pos: return +expression;
			case AST.UnaryOperatorType.Neg: return -expression;
		}
	}

	protected onFunctionCall(node: AST.FunctionCall): any {
		const args = node.args.map(x => this.evaluate(x));
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

	protected onLiteral(node: AST.Literal): any {
		return node.value;
	}

	protected onTemplate(node: AST.Template): any {
		const segments = node.segments.map(x => this.evaluate(x));
		if (segments.some(seg => seg === undefined)) return undefined;

		return segments.join("");
	}

	protected onSubstitution(node: AST.Substitution): any {
		const expression = this.evaluate(node.expression);
		if (expression === undefined) return undefined;

		return String(expression);
	}

	protected onText(node: AST.Text): any {
		return node.value;
	}

	protected onVariable(node: AST.Variable): any {
		return this.values.get(Variable.key(node.name));
	}

	protected onReference(node: AST.Reference): any {
		return this.values.get(Reference.key(node.id, node.modifier, node.scope));
	}
}