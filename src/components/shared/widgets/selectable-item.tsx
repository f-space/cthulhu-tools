import React from 'react';
import classNames from 'classnames';
import { Checkbox, CheckboxProps } from "./input";
import style from "./selectable-item.scss";

export interface SelectableItemProps extends React.HTMLAttributes<HTMLElement> {
	checkbox: CheckboxProps;
}

export function SelectableItem(props: SelectableItemProps) {
	const { checkbox, className, children, ...rest } = props;

	return <div {...rest} className={classNames(className, style['container'])}>
		<Checkbox {...checkbox} className={style['checkbox']} />
		{children}
	</div>
}