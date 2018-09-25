import React from 'react';
import classNames from 'classnames';
import style from "./page.scss";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
	heading: string;
	navs?: React.ReactNode;
	flexible?: boolean;
}

export function Page({ id, className, heading, navs, flexible, children, ...rest }: PageProps) {
	return <div {...rest} id={id} className={classNames(className, style['page'], { [style['flexible']]: flexible })}>
		<header className={style['header']}>
			<h2 className={style['heading']}>{heading}</h2>
		</header>
		{
			navs && <nav className={style['navs']}>
				{navs}
			</nav>
		}
		<div className={style['content']}>
			{children}
		</div>
	</div>
}