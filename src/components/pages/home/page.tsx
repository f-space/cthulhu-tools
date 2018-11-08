import React from 'react';
import { HomeTemplate } from "./template";
import Summary from "./summary.jsx.pug";
import Caveat from "./caveat.jsx.pug";

export function HomePage() {
	return <HomeTemplate summary={Summary} caveat={Caveat} />
}