import React from 'react';
import { Route, NavLink, NavLinkProps } from 'react-router-dom';
import classNames from 'classnames';
import style from "styles/frame/navigation.scss";

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> { }

export interface NavigationLinkProps extends NavLinkProps {
	to: string;
}

export interface NavigationIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	path: string;
}

export default function Navigation(props: NavigationProps) {
	const { className, ...rest } = props;

	return <nav {...rest} className={classNames(className, style['navigation'])}>
		<NavigationLink to="/dice">Dice</NavigationLink>
		<NavigationLink to="/status">Status</NavigationLink>
		<NavigationIndicator path="/status/character-management">
			<span>Character</span>
			<span>Management</span>
		</NavigationIndicator>
		<NavigationIndicator path="/status/character-edit">
			<span>Character</span>
			<span>Edit</span>
		</NavigationIndicator>
	</nav>
}

function NavigationLink({ to, className, children, ...rest }: NavigationLinkProps) {
	const classList = [
		className,
		style['nav-item'],
		{ [style['two-lines']]: Array.isArray(children) && children.length >= 2 },
	];

	return <Route path={to} children={({ match }) => {
		return <NavLink {...rest} className={classNames(classList)} activeClassName={style['active']} exact to={to} replace={Boolean(match)}>
			{children}
		</NavLink>
	}} />
}

function NavigationIndicator({ path, className, children, ...rest }: NavigationIndicatorProps) {
	const classList = [
		className,
		style['nav-item'],
		style['indicator'],
		style['active'],
		{ [style['two-lines']]: Array.isArray(children) && children.length >= 2 },
	];

	return <Route exact path={path} children={({ match }) => {
		if (!match) classList.push(style['hidden']);

		return <div {...rest} className={classNames(classList)}>{children}</div>
	}} />
}