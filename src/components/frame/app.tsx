import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from "components/frame/header";
import Navigation from "components/frame/navigation";
import Dialog from "components/frame/dialog";
import Home from "components/pages/home";
import Dice from "components/pages/dice";
import Status from "components/pages/status";
import CharacterManagement from "components/pages/character-management";
import CharacterEdit from "components/pages/character-edit";
import store from "redux/store";
import style from "styles/frame/app.scss";

export default class App extends React.Component {
	public render() {
		return <Provider store={store as any}>
			<Dialog.Provider>
				<HashRouter>
					<div className={style['app']}>
						<Dialog.Slot>
							{ref => <div className={style['overlay']} ref={ref} />}
						</Dialog.Slot>
						<div className={style['container']}>
							<Header className={style['header']} />
							<main className={style['content']}>
								<Switch>
									<Route exact path="/" component={Home} />
									<Route exact path="/dice" component={Dice} />
									<Route exact path="/status" component={Status} />
									<Route exact path="/status/character-management" component={CharacterManagement} />
									<Route exact path="/status/character-edit/:uuid?" component={CharacterEdit} />
								</Switch>
							</main>
							<Navigation className={style['navigation']} />
						</div>
					</div>
				</HashRouter>
			</Dialog.Provider>
		</Provider>
	}
}