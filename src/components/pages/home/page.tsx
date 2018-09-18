import React from 'react';
import { HomeTemplate } from "./template";
import HomeContent from "./page.jsx.pug";
import style from "./page.scss";

export function HomePage() {
	return <HomeTemplate>
		<HomeContent {...style} />
	</HomeTemplate>
}