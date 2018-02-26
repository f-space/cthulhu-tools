import React from 'react';
import classNames from 'classnames';
import style from "styles/organisms/dice-type-selector.scss";

export interface DiceTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
	types: string[];
	selected?: string;
	onTypeChange(type: string): void;
}

export default class DiceTypeSelector extends React.Component<DiceTypeSelectorProps> {
	public constructor(props: DiceTypeSelectorProps, context: any) {
		super(props, context);

		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { className, ...rest } = this.props;

		return <div className={classNames(className, style['dice-sets'])}>
			{
				this.props.types.map(type => {
					const className = classNames(
						style['dice-set'],
						{ [style['active']]: type === this.props.selected }
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