import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { DocumentTitle } from "./document-title";
import style from "./page.scss";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
	heading: string;
	navs?: Navigation[];
	pageTitle: string | boolean;
	flexible?: boolean;
}

export interface Navigation {
	to: string;
	label: string;
	icon: FontAwesomeIconProps['icon'];
}

export function Page({ className, heading, pageTitle, navs, flexible, children, ...rest }: PageProps) {
	const title = typeof pageTitle !== 'boolean'
		? pageTitle
		: (pageTitle ? heading : null);

	return <DocumentTitle title={title}>
		<div {...rest} className={classNames(className, style['page'], { [style['flexible']]: flexible })}>
			<header className={style['header']}>
				<h2 className={style['heading']}>{heading}</h2>
			</header>
			{
				navs && <nav className={style['navs']}>
					{
						navs.map(({ to, label, icon }) =>
							<Link key={to} className={style['nav']} to={to} aria-label={label}><FontAwesomeIcon icon={icon} /></Link>
						)
					}
				</nav>
			}
			<div className={style['content']}>
				{children}
			</div>
		</div>
	</DocumentTitle>
}