import React from 'react';
import classNames from 'classnames';
import { Toggle } from "components/shared/widgets/input";
import style from "./dice-type-selector.scss";

export interface DiceTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
	types: string[];
	selected?: string;
	onTypeChange(type: string): void;
}

export class DiceTypeSelector extends React.Component<DiceTypeSelectorProps> {
	public constructor(props: DiceTypeSelectorProps) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { types, selected, onTypeChange, className, ...rest } = this.props;

		return <div {...rest} className={classNames(className, style['container'])}>
			{
				types.map(type =>
					<Toggle
						key={type}
						className={style['item']}
						checked={type === selected}
						on={type}
						off={type}
						data-type={type}
						onChange={this.handleChange} />
				)
			}
		</div>
	}

	private handleChange(e: React.ChangeEvent<HTMLElement>): void {
		const target = e.currentTarget;
		const type = target.dataset['type'];
		if (type !== undefined) this.props.onTypeChange(type);
	}
}