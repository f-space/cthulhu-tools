import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import { State } from "redux/store";
import { getDataProvider } from "redux/selectors/status";
import Page from "components/templates/page";
import style from "styles/pages/status.scss";

export interface StatusPageProps {
	provider: DataProvider;
	characters: Status[];
}

const mapStateToProps = (state: State) => {
	const provider = getDataProvider(state);
	const { views } = state.status.view;
	const characters = views
		.filter(view => view.visible)
		.keySeq()
		.map(uuid => new EvaluationContext({ character: uuid }, provider))
		.filter(context => context.guard())
		.map(context => new Status(context as EvaluationContext))
		.map(status => new Status(status.$context, new ExternalCache(CacheStorage, status.$hash)))
		.sort((x, y) => String.prototype.localeCompare.call(x.name, y.name))
		.toArray();
	return { provider, characters };
};

export class StatusPage extends React.Component<StatusPageProps> {
	public render() {
		const { characters } = this.props;

		return <Page id="status" heading={<h2>ステータス</h2>} navs={
			<Link to="/status/character-management">管理</Link>
		}>
			<div className={style['characters']}>
				{
					characters.map(character =>
						<section key={character.$uuid} className={style['character']}>
							{this.renderAttributes(character)}
							{this.renderSkills(character)}
							{this.renderItems(character)}
						</section>
					)
				}
			</div>
		</Page>
	}

	private renderAttributes(character: Status) {
		const attributes = character.$attributes;

		return <section>
			<header><h3>人物/能力</h3></header>
			<dl className={style['attributes']}>
				{
					attributes.map(attribute =>
						<div key={attribute.uuid} className={style['attribute']}>
							<dt className={style['name']}>{attribute.name}</dt>
							<dd className={style['value']}>{character[attribute.id]}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}

	private renderSkills(character: Status) {
		const skills = character.$skills;

		return <section>
			<header><h3>技能</h3></header>
			<dl className={style['skills']}>
				{
					skills.map(skill =>
						<div key={skill.id} className={style['skill']}>
							<dt className={style['name']}>{skill.name}</dt>
							<dd className={style['value']}>{character[skill.id]}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}

	private renderItems(character: Status) {
		const { provider } = this.props;
		const items = provider.item.get(Object.keys(character.$character.params.item));

		return <section>
			<header><h3>所持品</h3></header>
			<dl className={style['items']}>
				{
					items.map(item =>
						<div className={style['item']}>
							<dt className={style['name']}>{item.name}</dt>
							<dd className={style['description']}>{item.description}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}
}

export default connect(mapStateToProps)(StatusPage);