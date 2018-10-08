import React from 'react';
import style from "./section.scss";

export interface SectionProps {
	heading?: string;
	children?: React.ReactNode;
}

export function Section({ heading, children }: SectionProps) {
	return <section className={style['section']}>
		{heading && <h4 className={style['heading']}>技能</h4>}
		{children}
	</section>
}