import React from 'react';
import { Link, useMatch } from 'react-router';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import style from "./navigation.scss";

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> { }

interface NavItemProps {
	to: string;
	label: string;
	children?: React.ReactNode;
}

interface NavIconProps {
	icon: FontAwesomeIconProps['icon'];
}

export function Navigation(props: NavigationProps) {
	const { className, ...rest } = props;

	return <nav {...rest} className={classNames(className, style['navigation'])}>
		<NavItem to="/dice" label="ダイス"><NavIcon icon="dice" /></NavItem>
		<NavItem to="/status" label="ステータス"><NavIcon icon="users" /></NavItem>
	</nav>
}

function NavItem({ to, label, children }: NavItemProps) {
	const match = useMatch({
		path: to,
		caseSensitive: true,
		end: true,
	});
	const active = match !== null;

	const inner = <div className={classNames(style['item'], { [style['active']]: active })}>
		{children}
	</div>

	return active ? inner : <Link to={to} aria-label={label}>{inner}</Link>;
}

function NavIcon({ icon }: NavIconProps) {
	return <FontAwesomeIcon className={style['icon']} icon={icon} size="xs" />
}