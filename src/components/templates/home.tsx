import React from 'react';
import { Page } from "./shared/page";
import style from "styles/templates/home.scss";

export interface HomeTemplateProps {
	children: React.ReactNode;
}

export function HomeTemplate({ children }: HomeTemplateProps) {
	return <Page id="home" className={style['page']} heading={<h2>クトゥルフTRPGのための<wbr />Webアプリ</h2>}>
		{children}
	</Page>
}