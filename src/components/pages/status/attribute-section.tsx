import React from 'react';
import classNames from 'classnames';
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Status } from "models/status";
import { Section } from "./section";
import style from "./attribute-section.scss";

export interface AttributeSectionProps {
	status: Status;
}

export function AttributeSection({ status }: AttributeSectionProps) {
	const hash = status.current;
	const attributes = status.context.profile.attributes;

	return <Section>
		<dl className={style['attributes']}>
			{
				attributes.map(attribute =>
					<div key={attribute.uuid} className={classNames(style['attribute'], style[attribute.type], style[`id-${attribute.id}`])}>
						<dt className={style['name']}>{attribute.name}</dt>
						<dd className={style['value']}>
							<EvaluationText target={`@attr:${attribute.id}`} hash={hash} />
						</dd>
					</div>
				)
			}
		</dl>
	</Section>
}