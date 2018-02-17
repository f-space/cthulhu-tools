import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Header from "components/frame/header";
import Navigation from "components/frame/navigation";
import { DialogProvider, DialogSlot } from "components/frame/dialog";
import Home from "components/pages/home";
import Dice from "components/pages/dice";
import Status from "components/pages/status";
import CharacterManagement from "components/pages/character-management";
import CharacterEdit from "components/pages/character-edit";
import style from "styles/frame/app.scss";

export default class App extends React.Component {
	public render() {
		return <HashRouter>
			<div className={style['app']}>
				<DialogProvider>
					<DialogSlot className={style['overlay']}>
					</DialogSlot>
					<div className={style['container']}>
						<Header className={style['header']} />
						<main className={style['content']}>
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/dice" component={Dice} />
								<Route exact path="/status" component={Status} />
								<Route exact path="/status/character-management" component={CharacterManagement} />
								<Route exact path="/status/character-edit" component={CharacterEdit} />
							</Switch>
						</main>
						<Navigation className={style['navigation']} />
					</div>
				</DialogProvider>
			</div>
		</HashRouter>
	}
}