import React from 'react';
import { Link, RouteComponentProps, matchPath, withRouter } from 'react-router-dom';
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import style from "./navigation.scss";

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> { }

interface NavItemInnerProps extends RouteComponentProps {
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

function NavItemInner({ to, label, location, children }: NavItemInnerProps) {
	const match = Boolean(matchPath(location.pathname, { path: to, exact: true }));

	const className = classNames(style['item'], { [style['active']]: match });
	const item = <div className={className}>{children}</div>

	return match ? item : <Link to={to} aria-label={label}>{item}</Link>;
}

const NavItem = withRouter(NavItemInner);

function NavIcon({ icon }: NavIconProps) {
	return <FontAwesomeIcon className={style['icon']} icon={icon} size="xs" />
}