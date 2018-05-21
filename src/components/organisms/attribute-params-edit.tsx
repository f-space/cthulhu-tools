import React from 'react';
import { Attribute } from "models/status";
import { AttributeInput } from "components/molecules/attribute-input";

export interface AttributeParamsEditProps {
	name: string;
	attributes: ReadonlyArray<Attribute>;
}

export class AttributeParamsEdit extends React.PureComponent<AttributeParamsEditProps> {
	public render() {
		const { name, attributes } = this.props;

		return <React.Fragment>
			{
				attributes.map(attribute =>
					<AttributeInput
						key={attribute.uuid}
						name={`${name}.${attribute.id}`}
						attribute={attribute} />
				)
			}
		</React.Fragment>
	}
}