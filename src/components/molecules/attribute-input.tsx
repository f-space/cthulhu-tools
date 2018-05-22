import React from 'react';
import classNames from 'classnames';
import { Expression, Format, Attribute, InputMethod } from "models/status";
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
				<EvaluationText id={attribute.id} hash={null} />
			</div>
		</div>
	}

	private renderInput(method: InputMethod): React.ReactNode {
		const props = {
			key: method.name,
			name: `${this.props.name}.${method.name}`,
		}

		switch (method.type) {
			case 'dice': return <AttributeDiceInput {...props} method={method} />
			case 'number': return <AttributeNumberInput {...props} method={method} />
			case 'text': return <AttributeTextInput {...props} method={method} />
		}
	}

	private segment(attribute: Attribute): (string | InputMethod)[] {
		const expression = getExpression(attribute);
		const segments = expression ? expression.segment() : [];
		return segments
			.map(x => typeof x === 'string' ? x : attribute.inputs.find(input => input.name === x.name))
			.filter(x => x) as (string | InputMethod)[];

		function getExpression(attribute: Attribute): Expression | Format {
			switch (attribute.type) {
				case 'integer': return attribute.expression;
				case 'number': return attribute.expression;
				case 'text': return attribute.format;
			}
		}
	}
}