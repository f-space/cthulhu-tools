import React from 'react';
import classNames from 'classnames';
import style from "styles/templates/page.scss";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
	heading: React.ReactNode;
	navs?: React.ReactNode;
}

export default function Page({ id, className, heading, navs, children, ...rest }: PageProps) {
	return <div id={id} className={classNames(className, style['page'])}>
		<header className={style['heading']}>
			{heading}
		</header>
		{
			navs && <nav className={style['navs']}>
				{navs}
			</nav>
		}
		{children}
	</div>
}