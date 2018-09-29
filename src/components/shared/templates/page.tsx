import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import style from "./page.scss";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
	heading: string;
	navs?: Navigation[];
	flexible?: boolean;
}

export interface Navigation {
	to: string;
	icon: FontAwesomeIconProps['icon'];
}

export function Page({ id, className, heading, navs, flexible, children, ...rest }: PageProps) {
	return <div {...rest} id={id} className={classNames(className, style['page'], { [style['flexible']]: flexible })}>
		<header className={style['header']}>
			<h2 className={style['heading']}>{heading}</h2>
		</header>
		{
			navs && <nav className={style['navs']}>
				{
					navs.map(({ to, icon }) =>
						<Link key={to} className={style['nav']} to={to}><FontAwesomeIcon icon={icon} /></Link>
					)
				}
			</nav>
		}
		<div className={style['content']}>
			{children}
		</div>
	</div>
}