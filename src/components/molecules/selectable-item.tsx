import React from 'react';
import classNames from 'classnames';
import { Checkbox } from "components/atoms/input";
import style from "styles/molecules/selectable-item.scss";

export interface SelectableItemProps extends React.HTMLAttributes<HTMLElement> {
	name?: string;
	checked?: boolean;
	onToggle?(name: string, checked: boolean): void;
}

export default class SelectableItem extends React.Component<SelectableItemProps> {
	public constructor(props: SelectableItemProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { name, checked, onToggle, className, children, ...rest } = this.props;

		return <div {...rest} className={classNames(className, style['container'])}>
			<Checkbox className={style['checkbox']} name={name} checked={Boolean(checked)} onChange={this.handleChange} />
			{children}
		</div>
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const checked = target.checked;

		if (this.props.onToggle) this.props.onToggle(name, checked);
	}
}