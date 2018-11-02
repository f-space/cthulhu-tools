import React from 'react';
import { Page } from "components/shared/templates/page";
import style from "./template.scss";

export interface HomeTemplateProps {
	children: React.ReactNode;
}

export function HomeTemplate({ children }: HomeTemplateProps) {
	return <Page id="home" heading="クトゥルフTRPG ツール" pageTitle={false}>
		<div className={style['content']}>
			{children}
		</div>
	</Page>
}