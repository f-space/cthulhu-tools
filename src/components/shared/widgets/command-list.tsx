import React from 'react';
import classNames from 'classnames';
import { CommandButton } from "./command-button";
import style from "./command-list.scss";

export interface CommandListProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	commands: CommandListItem[];
}

export interface CommandListItem {
	value: string;
	disabled: boolean;
	children: React.ReactNode;
}

export function CommandList(props: CommandListProps) {
	const { name, commands, className, ...rest } = props;

	return <div {...rest} className={classNames(className, style['commands'])}>
		{
			commands.map(item => <CommandButton key={item.value} {...item} className={style['command']} name={name} />)
		}
	</div>
}