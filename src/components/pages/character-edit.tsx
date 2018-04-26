import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormApi, Decorator, getIn } from 'final-form';
import { Form, Field, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Reference, Character, CharacterParams, AttributeParams, SkillParams, DataProvider, EvaluationChain, buildResolver, buildEvaluator, buildValidator } from "models/status";
import { State, Dispatch } from "redux/store";
import { LoadState } from "redux/states/status";
import { getLoadState, getDataProvider } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";
import { Button, SubmitButton } from "components/atoms/button";
import AttributeInput from "components/molecules/attribute-input";
import SkillInput, { SkillInputValue } from "components/molecules/skill-input";
import Page from "components/templates/page";
import style from "styles/pages/character-edit.scss";

export interface CharacterEditPageProps extends RouteComponentProps<{ uuid?: string }> {
	loadState: LoadState;
	provider: DataProvider;
	dispatcher: StatusDispatcher;
}

interface FormValues {
	chain: EvaluationChain;
	attributes: AttributeParams;
	skills: SkillInputValue[];
}

function throttle<T extends (...args: any[]) => void>(interval: number, fn: T): T {
	let id = undefined as number | undefined;
	let last = -Infinity;

	function wrapper(this: any, ...args: any[]): void {
		const elapsed = performance.now() - last;
		const exec = () => {
			id = undefined;
			last = performance.now();
			fn.apply(this, args);
		}

		window.clearTimeout(id);
		if (elapsed > interval) {
			exec();
		} else {
			id = window.setTimeout(exec, interval - elapsed);
		}
	}

	return wrapper as T;
}

function EvaluationResult(props: { id: string, base?: boolean }) {
	return <Field name="chain" subscription={{ value: true }} render={({ input: { value } }) => {
		const { id, base } = props;
		const chain = value as EvaluationChain;
		const result = chain.evaluate(new Reference(id, base ? 'base' : null), null);

		return result !== undefined ? result : "-";
	}} />
}

const mapStateToProps = (state: State) => {
	const loadState = getLoadState(state);
	const provider = getDataProvider(state);
	return { loadState, provider };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
}

export class CharacterEditPage extends React.Component<CharacterEditPageProps> {
	public constructor(props: CharacterEditPageProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public get uuid(): string | undefined { return this.props.match.params.uuid; }

	public componentWillMount(): void {
		if (this.props.loadState === 'unloaded') {
			this.props.dispatcher.load();
		}
	}

	public render() {
		if (this.props.loadState !== 'loaded') return null;

		const { provider } = this.props;
		const profile = provider.profile.default;
		const attributes = profile && provider.attribute.get(profile.attributes);
		const skills = profile && provider.skill.get(profile.skills);
		const initialValues = this.makeInitialValues();
		const decorators = [this.createEvaluationDecorator()];
		const evaluate = (id: string, base?: boolean) => <EvaluationResult id={id} base={base} />

		return <Page id="character-edit" heading={<h2>キャラクター編集</h2>}>
			<Form initialValues={initialValues}
				decorators={decorators}
				mutators={{ ...arrayMutators }}
				onSubmit={this.handleSubmit}
				render={({ handleSubmit }) =>
					<form className={style['entry']} onSubmit={handleSubmit}>
						<section className={style['attributes']}>
							<header><h3>能力値</h3></header>
							{
								attributes && attributes.map(attribute =>
									<AttributeInput
										key={attribute.uuid}
										name={`attributes.${attribute.id}`}
										attribute={attribute}
										evaluate={evaluate} />
								)
							}
						</section>
						<section className={style['skills']}>
							<header><h3>技能</h3></header>
							<Field name="skills" subscription={{ value: true }} render={({ input: { value } }) => {
								const skills = value as SkillInputValue[];
								const consumed = skills.reduce((sum, skill) => sum + skill.points, 0);

								return <div className={style['point-stats']}>
									<span className={style['consumed']}>{consumed}</span>
									/
									<Field name="chain" subscription={{ value: true }} render={({ input: { value } }) => {
										const chain = value as EvaluationChain;
										const oskp = chain.evaluate(new Reference('oskp'), null);
										const hskp = chain.evaluate(new Reference('hskp'), null);
										const available = oskp + hskp;

										return <span className={style['available']}>{String(available)}</span>
									}} />
								</div>
							}} />
							<FieldArray name="skills" render={({ fields }) =>
								<React.Fragment>
									<div className={style['commands']}>
										<Button onClick={() => fields.push({ id: "", points: 0 })}>追加</Button>
										<Button onClick={() => fields.pop()}>削除</Button>
									</div>
									{
										fields.map((name, index) =>
											<SkillInput key={name} name={name} skills={skills || []} evaluate={evaluate} />
										)
									}
								</React.Fragment>
							} />
						</section>
						<section className={style['items']}>
							<header><h3>所持品</h3></header>
							<div className={style['commands']}>
								<Button>追加</Button>
								<Button>削除</Button>
							</div>
						</section>
						<div className={style['actions']}>
							<FormSpy subscription={{ valid: true, submitting: true }} render={({ valid, submitting }) =>
								<SubmitButton className={style['ok']} disabled={!valid || submitting} commit>OK</SubmitButton>
							} />
							<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
						</div>
					</form>
				} />
		</Page>
	}

	private handleSubmit(values: object): Promise<void> {
		const { attributes, skills } = values as FormValues;
		const attribute = attributes;
		const skill = skills.reduce((obj, { id, points }) => (obj[id] = points, obj), Object.create(null));
		const params = { attribute, skill, item: Object.create(null) };

		return this.saveCharacter(params).then(() => this.toCharacterManagementPage());
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.toCharacterManagementPage();
	}

	private buildChain(params: CharacterParams) {
		const { provider } = this.props;
		const profile = provider.profile.default;
		const resolver = buildResolver({
			attributes: profile && provider.attribute.get(profile.attributes),
			skills: profile && provider.skill.get(profile.skills),
		});
		const evaluator = buildEvaluator({ params });
		const validator = buildValidator({ attribute: true, skill: true });

		return new EvaluationChain({ resolver, evaluator, validator });
	}

	private makeInitialValues(): FormValues {
		if (this.uuid !== undefined) {
			const { provider } = this.props;
			const character = provider.character.get(this.uuid);
			const params = character && character.params;
			if (params) {
				const chain = this.buildChain(params);
				const skills = Object.entries(params.skill).map(([id, points]) => ({ id, points }));

				return {
					chain,
					attributes: params.attribute,
					skills,
				};
			}
		}

		return this.makeEmptyValues();
	}

	private makeEmptyValues(): FormValues {
		const attribute = Object.create(null);
		const skill = Object.create(null);
		const params = { attribute, skill, item: Object.create(null) };
		const chain = this.buildChain(params);

		return {
			chain,
			attributes: attribute,
			skills: [],
		};
	}

	private createEvaluationDecorator(): Decorator {
		return form => {
			let prev = {};
			return form.subscribe(throttle(250, state => {
				const values = state.values as FormValues;

				if (["attributes", "skills"].some(key => getIn(values, key) !== getIn(prev, key))) {
					const attribute = values.attributes;
					const skill = values.skills.reduce((obj, { id, points }) => (obj[id] = points, obj), Object.create(null));
					const params = { attribute, skill, item: Object.create(null) };
					const chain = this.buildChain(params);

					form.change("chain", chain);
				}

				prev = values;
			}), { values: true });
		}
	}

	private toCharacterManagementPage(): void {
		const { history } = this.props;

		history.push("/status/character-management");
	}

	private async saveCharacter(params: CharacterParams): Promise<void> {
		const { provider, dispatcher } = this.props;
		const profile = provider.profile.default;
		if (profile) {
			const character = new Character({
				uuid: this.uuid,
				profile: profile.uuid,
				params,
			});

			if (this.uuid === undefined) {
				await dispatcher.character.create(character);
			} else {
				await dispatcher.character.update(character);
			}
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterEditPage));