import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import style from "styles/frame/header.scss";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> { }

export default function Header(props: HeaderProps) {
	const { className, ...rest } = props;
	return <header {...rest} className={classNames(className, style['header'])}>
		<h1 className={style['title']}>
			<Link className={style['title-text']} to="/">Cthulhu Tools</Link>
		</h1>
	</header>
}