import React from 'react';
import classNames from 'classnames';
import { AST, Variable, Expression, AttributeType, Attribute, InputType, InputMethod } from "models/status";
import { EvaluationText } from "components/atoms/evaluation-text";
import { AttributeDiceInput } from "components/molecules/attribute-dice-input";
import { AttributeNumberInput } from "components/molecules/attribute-number-input";
import { AttributeTextInput } from "components/molecules/attribute-text-input";
import style from "styles/molecules/attribute-input.scss";

export interface AttributeInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	attribute: Attribute;
}

export class AttributeInput extends React.PureComponent<AttributeInputProps> {
	public render() {
		const { name, attribute, className, ...rest } = this.props;
		const segments = this.segment(attribute);

		return <div {...rest} className={classNames(className, style['attribute'])}>
			<div className={style['name']}>{attribute.name}</div>
			<div className={style['input']}>
				{segments.map(segment => typeof segment === 'string' ? segment : this.renderInput(segment))}
			</div>
			<div className={style['value']}>
				<EvaluationText expression={attribute.id} hash={null} />
			</div>
		</div>
	}

	private renderInput(method: InputMethod): React.ReactNode {
		const props = {
			key: method.name,
			name: `${this.props.name}.${method.name}`,
		}

		switch (method.type) {
			case InputType.Dice: return <AttributeDiceInput {...props} method={method} />
			case InputType.Number: return <AttributeNumberInput {...props} method={method} />
			case InputType.Text: return <AttributeTextInput {...props} method={method} />
		}
	}

	private segment(attribute: Attribute): (string | InputMethod)[] {
		const expression = getExpression(attribute);
		const segments = expression ? (new ASTSegmenter()).segment(expression.ast) : [];
		return segments
			.map(x => typeof x === 'string' ? x : attribute.inputs.find(input => input.name === x.name))
			.filter(x => x) as (string | InputMethod)[];

		function getExpression(attribute: Attribute): Expression {
			switch (attribute.type) {
				case AttributeType.Integer: return attribute.expression;
				case AttributeType.Number: return attribute.expression;
				case AttributeType.Text: return attribute.expression;
			}
		}
	}
}

class ASTSegmenter {
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