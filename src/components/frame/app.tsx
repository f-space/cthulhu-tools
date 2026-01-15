import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { Header } from "components/frame/header";
import { Navigation } from "components/frame/navigation";
import { DialogProvider, DialogSlot } from "components/frame/dialog";
import { HomePage } from "components/pages/home/page";
import { LicensePage } from "components/pages/license/page";
import { DicePage } from "components/pages/dice/page";
import { StatusPage } from "components/pages/status/page";
import { CharacterManagementPage } from "components/pages/character-management/page";
import { CharacterEditPage } from "components/pages/character-edit/page";
import store from "redux/store";
import style from "./app.scss";

export class App extends React.Component {
	public render() {
		return <Provider store={store}>
			<DialogProvider>
				<BrowserRouter>
					<div className={style['app']}>
						<div className={style['overlay']}>
							<DialogSlot />
						</div>
						<div className={style['container']}>
							<Header className={style['header']} />
							<main className={style['content']}>
								<Routes>
									<Route path="/" element={<HomePage />} />
									<Route path="/license" element={<LicensePage />} />
									<Route path="/dice" element={<DicePage />} />
									<Route path="/status" element={<StatusPage />} />
									<Route path="/status/character-management" element={<CharacterManagementPage />} />
									<Route path="/status/character-edit/:uuid?" element={<CharacterEditPage />} />
								</Routes>
							</main>
							<Navigation className={style['navigation']} />
						</div>
					</div>
				</BrowserRouter>
			</DialogProvider>
		</Provider>
	}
}