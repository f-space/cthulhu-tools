import React from 'react';
import classNames from 'classnames';
import SelectableItem from "components/molecules/selectable-item";
import style from "styles/molecules/selectable-list.scss";

export interface SelectableListProps<T> extends React.HTMLAttributes<HTMLElement> {
	field: string;
	items: T[];
	render(item: T): SelectableListRenderResult;
}

export interface SelectableListRenderResult {
	key: string | number;
	content: React.ReactNode;
}

export default function SelectableList<T>(props: SelectableListProps<T>) {
	const { field, items, render, className, ...rest } = props;

	return <div {...rest} className={classNames(className, style['list'])}>
		{
			items.map(item => {
				const { key, content } = render(item);

				return <SelectableItem key={key} className={style['item']} checkbox={{ field, value: key }}>
					{content}
				</SelectableItem>
			})
		}
	</div>
}