import React from 'react';
import { Route, Link } from 'react-router-dom';
import classNames from 'classnames';
import style from "styles/frame/header.scss";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> { }

export function Header(props: HeaderProps) {
	const { className, ...rest } = props;
	const HOME_PATH = "/";

	return <header {...rest} className={classNames(className, style['header'])}>
		<h1 className={style['title']}>
			<Route path={HOME_PATH} children={({ match }) =>
				<Link className={style['title-text']} to={HOME_PATH} replace={Boolean(match)}>Cthulhu Tools</Link>
			} />
		</h1>
	</header>
}