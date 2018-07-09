import React from 'react';
import classNames from 'classnames';
import { Attribute, InputType, InputMethod } from "models/status";
import { EvaluationConsumer } from "components/functions/evaluation";
import { EvaluationText } from "components/atoms/evaluation-text";
import { ExpressionArranger } from "./expression-arranger";
import { AttributeDiceInput } from "./dice-input";
import { AttributeNumberInput } from "./number-input";
import { AttributeTextInput } from "./text-input";
import style from "styles/molecules/attribute-input.scss";

export interface AttributeInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	attribute: Attribute;
}

export class AttributeInput extends React.PureComponent<AttributeInputProps> {
	public render() {
		const { name, attribute, className, ...rest } = this.props;

		return <div {...rest} className={classNames(className, style['attribute'])}>
			<div className={style['name']}>{attribute.name}</div>
			<div className={style['input']}>
				<EvaluationConsumer>
					{chain => {
						const arranger = new ExpressionArranger(chain.resolver);
						const segments = arranger.arrange(attribute);
						return segments.map((segment, i) => {
							if (i % 2 === 0) {
								return segment;
							} else {
								const input = attribute.inputs.find(input => input.name === segment);
								return input ? this.renderInput(input) : null;
							}
						});
					}}
				</EvaluationConsumer>
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
}

