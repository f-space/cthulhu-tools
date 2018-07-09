import React from 'react';
import { HomeTemplate } from "components/templates/home";
import HomeContent from "templates/pages/home.jsx.pug";
import style from "styles/pages/home.scss";

export function HomePage() {
	return <HomeTemplate>
		<HomeContent {...style} />
	</HomeTemplate>
}