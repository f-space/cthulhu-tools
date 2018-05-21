import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Header } from "components/frame/header";
import { Navigation } from "components/frame/navigation";
import { DialogProvider, DialogSlot } from "components/frame/dialog";
import { HomePage } from "components/pages/home";
import { DicePage } from "components/pages/dice";
import { StatusPage } from "components/pages/status";
import { CharacterManagementPage } from "components/pages/character-management";
import { CharacterEditPage } from "components/pages/character-edit";
import store from "redux/store";
import style from "styles/frame/app.scss";

export class App extends React.Component {
	public render() {
		return <Provider store={store as any}>
			<DialogProvider>
				<HashRouter>
					<div className={style['app']}>
						<DialogSlot>
							{ref => <div className={style['overlay']} ref={ref} />}
						</DialogSlot>
						<div className={style['container']}>
							<Header className={style['header']} />
							<main className={style['content']}>
								<Switch>
									<Route exact path="/" component={HomePage} />
									<Route exact path="/dice" component={DicePage} />
									<Route exact path="/status" component={StatusPage} />
									<Route exact path="/status/character-management" component={CharacterManagementPage} />
									<Route exact path="/status/character-edit/:uuid?" component={CharacterEditPage} />
								</Switch>
							</main>
							<Navigation className={style['navigation']} />
						</div>
					</div>
				</HashRouter>
			</DialogProvider>
		</Provider>
	}
}