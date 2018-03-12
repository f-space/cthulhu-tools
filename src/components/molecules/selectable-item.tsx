import React from 'react';
import classNames from 'classnames';
import { Checkbox, CheckboxProps } from "components/atoms/input";
import style from "styles/molecules/selectable-item.scss";

export interface SelectableItemProps extends React.HTMLAttributes<HTMLElement> {
	checkbox: CheckboxProps;
}

export default function SelectableItem(props: SelectableItemProps) {
	const { checkbox, className, children, ...rest } = props;

	return <div {...rest} className={classNames(className, style['container'])}>
		<Checkbox {...checkbox} className={style['checkbox']} />
		{children}
	</div>
}