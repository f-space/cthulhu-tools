import React from 'react';
import Page from "components/templates/page";
import HomeContent from "templates/pages/home.pugx";
import style from "styles/pages/home.scss";

export default function HomePage() {
	return <Page id={style['home']} heading={<h2>クトゥルフTRPGのための<wbr />Webアプリ</h2>}>
		<HomeContent {...style} />
	</Page>
}