import React from 'react';
import classNames from 'classnames';
import style from "styles/templates/shared/page.scss";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
	heading: React.ReactNode;
	navs?: React.ReactNode;
}

export function Page({ id, className, heading, navs, children, ...rest }: PageProps) {
	return <div {...rest} id={id} className={classNames(className, style['page'])}>
		<header className={style['heading']}>
			{heading}
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