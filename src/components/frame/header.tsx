import React from 'react';
import { Link, useMatch } from 'react-router';
import classNames from 'classnames';
import { Menu } from "./menu";
import style from "./header.scss";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> { }

export function Header(props: HeaderProps) {
	const { className, ...rest } = props;
	const HOME_PATH = "/";

	const match = useMatch({
		path: HOME_PATH,
		caseSensitive: true,
		end: true,
	});

	return <header {...rest} className={classNames(className, style['header'])}>
		<h1 className={style['title']}>
			<Link className={style['title-text']} to={HOME_PATH} replace={match !== null}>Cthulhu Tools</Link>
		</h1>
		<Menu className={style['menu']} />
	</header>
}