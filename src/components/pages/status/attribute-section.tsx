import React from 'react';
import classNames from 'classnames';
import { Status, Attribute } from "models/status";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Section } from "./section";
import style from "./attribute-section.scss";

export interface AttributeSectionProps {
	status: Status;
	edit: boolean;
	onEdit(target: Attribute): void;
}

export function AttributeSection({ status, edit, onEdit }: AttributeSectionProps) {
	const hash = status.current;
	const attributes = status.context.profile.attributes;

	return <Section>
		<dl className={style['attributes']}>
			{
				attributes.map(attribute => {
					const editable = edit && !attribute.view;
					const classList = classNames(
						style['attribute'],
						style[attribute.type],
						style[`id-${attribute.id}`],
						{ [style['edit']]: edit },
						{ [style['editable']]: editable },
					);

					return <div key={attribute.uuid} className={classList} onClick={() => editable && onEdit(attribute)}>
						<dt className={style['name']}>{attribute.name}</dt>
						<dd className={style['value']}>
							<EvaluationText target={`@attr:${attribute.id}`} hash={hash} />
						</dd>
					</div>
				})
			}
		</dl>
	</Section>
}