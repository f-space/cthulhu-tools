import React from 'react';
import classNames from 'classnames';
import { Attribute, InputMethod } from "models/status";
import { substitute } from "models/eval";
import DiceInput from "components/molecules/attribute-dice-input";
import NumberInput from "components/molecules/attribute-number-input";
import TextInput from "components/molecules/attribute-text-input";
import style from "styles/molecules/attribute-input.scss";

export interface AttributeInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	attribute: Attribute;
	evaluate(id: string): React.ReactNode;
}

export default class AttributeInput extends React.Component<AttributeInputProps> {
	public render() {
		const { name, attribute, evaluate, className, ...rest } = this.props;
		const segments = this.segment(attribute);

		return <div {...rest} className={classNames(className, style['attribute'])}>
			<div className={style['name']}>{attribute.name}</div>
			<div className={style['input']}>
				{segments.map(segment => typeof segment === 'string' ? segment : this.renderInput(segment))}
			</div>
			<div className={style['value']}>{evaluate(attribute.id)}</div>
		</div>
	}

	private renderInput(method: InputMethod): React.ReactNode {
		const props = {
			key: method.name,
			name: `${this.props.name}.${method.name}`,
		}

		switch (method.type) {
			case 'dice': return <DiceInput {...props} method={method} />
			case 'number': return <NumberInput {...props} method={method} />
			case 'text': return <TextInput {...props} method={method} />
		}
	}

	private segment(attribute: Attribute): (string | InputMethod)[] {
		const values = attribute.inputs.reduce((obj, { name }) => (obj[name] = `var(${name})`, obj), Object.create(null));
		const expression = substitute(attribute.expression, values);
		return [...split(expression)].filter(x => x);

		function* split(expression: string) {
			let regexp = /var\((.*?)\)/g, position = 0;
			for (let match; match = regexp.exec(expression); position = regexp.lastIndex) {
				const { index, 1: name } = match;
				yield expression.slice(position, index);
				yield attribute.inputs.find(input => input.name === name) || "";
			}
			yield expression.slice(position);
		}
	}
}