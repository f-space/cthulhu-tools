import React from 'react';
import { Route, NavLink, NavLinkProps } from 'react-router-dom';
import classNames from 'classnames';
import style from "styles/frame/navigation.scss";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> { }
export interface NavigationLinkProps extends NavLinkProps { }
export interface NavigationIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	path: string;
}

export default function Navigation(props: NavigationProps) {
	const { className, ...rest } = props;

	return <nav {...rest} className={classNames(className, style['navigation'])}>
		<NavigationLink to="/dice">Dice</NavigationLink>
		<NavigationLink to="/status">Status</NavigationLink>
		<TransitionGroup component={(props: any) => props.children}>
			<NavigationIndicator path="/status/character-management">
				<span>Character</span>
				<span>Management</span>
			</NavigationIndicator>
			<NavigationIndicator path="/status/character-edit">
				<span>Character</span>
				<span>Edit</span>
			</NavigationIndicator>
		</TransitionGroup>
	</nav>
}

export function NavigationLink({ className, to, children, ...rest }: NavigationLinkProps) {
	const classList = [
		className,
		style['nav-item'],
		{ [style['two-lines']]: Array.isArray(children) && children.length >= 2 },
	];

	return <NavLink {...rest} className={classNames(classList)} activeClassName={style['active']} exact to={to}>
		{children}
	</NavLink>
}

export function NavigationIndicator({ className, path, children, ...rest }: NavigationIndicatorProps) {
	const classList = [
		className,
		style['nav-item'],
		style['indicator'],
		style['active'],
		{ [style['two-lines']]: Array.isArray(children) && children.length >= 2 },
	];

	return <Route exact path={path} render={() =>
		<CSSTransition classNames="slide" timeout={Infinity}>
			<div {...rest} className={classNames(classList)}>{children}</div>
		</CSSTransition>
	} />
}