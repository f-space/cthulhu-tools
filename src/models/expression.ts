import * as AST from "models/ast";
export { ParseContext } from "models/ast";

export class Input {
	public readonly key: string;
	public constructor(readonly name: string) {
		this.key = `\$${name}`;
	}
}

export class Reference {
	public readonly key: string;
	public constructor(readonly id: string, readonly modifier: string) {
		this.key = id + (modifier ? `:${modifier}` : "");
	}
}

export class Expression {
	readonly inputs: ReadonlyArray<Input>;
	readonly refs: ReadonlyArray<Reference>;

	public constructor(readonly ast: AST.Node) {
		const { inputs, refs } = this.collectVariables(ast);
		this.inputs = inputs;
		this.refs = refs;
	}

	public static parse(source: string, context?: AST.ParseContext): Expression | undefined {
		const result = AST.Parser.parse(source, context);

		return result.root && new Expression(result.root);
	}

	public static evaluate(source: string, context?: AST.ParseContext, values?: Map<string, number | string | undefined>): any {
		const expression = this.parse(source, context);

		return expression && expression.evaluate(values);
	}

	public evaluate(values?: Map<string, number | string | undefined>): any {
		const evaluator = new ASTEvaluator(values);

		return evaluator.evaluate(this.ast);
	}

	public segment(): (string | Input)[] {
		const segmenter = new ASTSegmenter();

		return segmenter.segment(this.ast);
	}

	private collectVariables(ast: AST.Node): { inputs: Input[], refs: Reference[] } {
		const inputs: Map<string, Input> = new Map();
		const refs: Map<string, Reference> = new Map();
		const visitor = (node: AST.Node) => {
			switch (node.type) {
				case AST.NodeType.InputVariable:
					const input = new Input(node.name);
					if (!inputs.has(input.key)) inputs.set(input.key, input);
					break;
				case AST.NodeType.Reference:
					const ref = new Reference(node.id, node.modifier);
					if (!refs.has(ref.key)) refs.set(ref.key, ref);
					break;
			}

			node.visitChildren(visitor);
		}
		visitor(ast);

		return { inputs: [...inputs.values()], refs: [...refs.values()] };
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
			case AST.NodeType.InputVariable:
				return this.onInputVariable(node);
			case AST.NodeType.Reference:
				return this.onReference(node);
			case AST.NodeType.Format:
				return this.onFormat(node);
			case AST.NodeType.Interpolation:
				return this.onInterpolation(node);
			case AST.NodeType.Text:
				return this.onText(node);
		}
	}

	protected abstract onBinaryOperator(node: AST.BinaryOperator): any;
	protected abstract onUnaryOperator(node: AST.UnaryOperator): any;
	protected abstract onFunctionCall(node: AST.FunctionCall): any;
	protected abstract onLiteral(node: AST.Literal): any;
	protected abstract onInputVariable(node: AST.InputVariable): any;
	protected abstract onReference(node: AST.Reference): any;
	protected abstract onFormat(node: AST.Format): any;
	protected abstract onInterpolation(node: AST.Interpolation): any;
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

	protected onInputVariable(node: AST.InputVariable): number | string | undefined {
		const input = new Input(node.name);

		return this.values.get(input.key);
	}

	protected onReference(node: AST.Reference): number | string | undefined {
		const ref = new Reference(node.id, node.modifier);

		return this.values.get(ref.key);
	}

	protected onFormat(node: AST.Format): string | undefined {
		const segments = node.segments.map(x => this.visit(x));
		if (segments.some(seg => seg === undefined)) return undefined;

		return segments.join("");
	}

	protected onInterpolation(node: AST.Interpolation): string | undefined {
		const expression = this.visit(node.expression);
		if (expression === undefined) return undefined;

		return String(expression);
	}

	protected onText(node: AST.Text): string {
		return node.value;
	}
}

class ASTSegmenter extends ASTVisitor {
	public segment(node: AST.Node): (string | Input)[] {
		function* flatten(segments: any[]): IterableIterator<string | Input> {
			for (const segment of segments) {
				if (Array.isArray(segment)) {
					yield* flatten(segment);
				} else {
					yield segment;
				}
			}
		}

		function* join(segments: IterableIterator<string | Input>) {
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

	protected onInputVariable(node: AST.InputVariable): any[] {
		return [new Input(node.name)];
	}

	protected onReference(node: AST.Reference): any[] {
		return [String(node)];
	}

	protected onFormat(node: AST.Format): any[] {
		const segments = node.segments.map(x => this.visit(x));

		return segments;
	}

	protected onInterpolation(node: AST.Interpolation): any[] {
		const expression = this.visit(node.expression);

		return expression;
	}

	protected onText(node: AST.Text): any[] {
		return [String(node)];
	}
}