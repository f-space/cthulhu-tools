import React from 'react';
import classNames from 'classnames';
import style from "styles/organisms/dice-type-selector.scss";

export interface DiceTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
	types: string[];
	selected?: string;
	onTypeChange(type: string): void;
}

export class DiceTypeSelector extends React.Component<DiceTypeSelectorProps> {
	public constructor(props: DiceTypeSelectorProps) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { types, selected, onTypeChange, className, ...rest } = this.props;

		return <div {...rest} className={classNames(className, style['dice-sets'])}>
			{
				types.map(type => {
					const className = classNames(
						style['dice-set'],
						{ [style['active']]: type === selected }
					);

					return <div key={type} className={className} onClick={this.handleClick} data-type={type}>{type}</div>
				})
			}
		</div>
	}

	private handleClick(e: React.MouseEvent<HTMLDivElement>): void {
		const target = e.currentTarget;
		const type = target.dataset['type'];
		if (type !== undefined) this.props.onTypeChange(type);
	}
}