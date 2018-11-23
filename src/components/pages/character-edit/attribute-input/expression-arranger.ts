import { AST, Reference, AttributeType, Attribute, PropertyResolver } from "models/status";

export class ExpressionArranger {
	private context!: Attribute;
	private depth!: number;

	public constructor(readonly resolver: PropertyResolver) { }

	public arrange(attribute: Attribute): string[] {
		this.context = attribute;
		this.depth = 0;

		return this.visit(attribute.expression.ast).split("\x00");
	}

	protected visit(node: AST.Node): string {
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

	protected onBinaryOperator(node: AST.BinaryOperator): string {
		const lhs = this.visit(node.lhs);
		const rhs = this.visit(node.rhs);
		const lhsSeg = node.priority < node.lhs.priority ? `(${lhs})` : lhs;
		const rhsSeg = node.priority > node.rhs.priority ? rhs : `(${rhs})`;
		return `${lhsSeg} ${node.op} ${rhsSeg}`;
	}

	protected onUnaryOperator(node: AST.UnaryOperator): string {
		const expression = this.visit(node.expression);
		const exprSeg = node.priority < node.expression.priority ? `(${expression})` : expression;
		return `${node.op}${exprSeg}`;
	}

	protected onFunctionCall(node: AST.FunctionCall): string {
		const args = node.args.map(x => this.visit(x));
		switch (node.fn) {
			case 'if': return `if ${args[0]} then ${args[1]} else ${args[2]}`;
			case 'and': return `${args[0]} \u2227 ${args[1]}`;
			case 'or': return `${args[0]} \u2228 ${args[1]}`;
			case 'not': return `\u00AC ${args[0]}`
			case 'floor': return `\u230A ${args[0]} \u230B`;
			case 'ceil': return `\u2308 ${args[0]} \u2309`;
			case 'round': return `\u230A ${args[0]} \u2309`;
			default: return `${node.fn}(${args.join(", ")})`;
		}
	}

	protected onLiteral(node: AST.Literal): string {
		return String(node.value);
	}

	protected onTemplate(node: AST.Template): string {
		return node.segments.map(x => this.visit(x)).join("");
	}

	protected onSubstitution(node: AST.Substitution): string {
		return this.visit(node.expression);
	}

	protected onText(node: AST.Text): string {
		return node.value;
	}

	protected onVariable(node: AST.Variable): string {
		return `\x00${node.name}\x00`;
	}

	protected onReference(node: AST.Reference): string {
		const ref = new Reference(node.id, node.modifier, node.scope);
		const property = this.resolver.resolve({ ref });
		if (property) {
			switch (property.type) {
				case 'attribute':
				case 'attribute:min':
				case 'attribute:max':
					const attribute = property.attribute;
					if (ref.id === this.context.id) {
						return this.recurse(attribute, ref);
					} else {
						return ref.modifier ? `${attribute.name}:${ref.modifier}` : attribute.name;
					}
				case 'skill':
				case 'skill:base':
				case 'skill:points':
					const skill = property.skill;
					return ref.modifier ? `${skill.name}:${ref.modifier}` : skill.name;
			}
		}

		return ref.key;
	}

	private recurse(attribute: Attribute, ref: Reference): string {
		const MAX_DEPTH = 3;
		if (this.depth++ < MAX_DEPTH) {
			switch (attribute.type) {
				case AttributeType.Integer:
				case AttributeType.Number:
					switch (ref.modifier) {
						case 'min': return attribute.min ? this.visit(attribute.min.ast) : "-\u221E";
						case 'max': return attribute.max ? this.visit(attribute.max.ast) : "+\u221E";
					}
					break;
			}
		}

		return ref.key;
	}
}