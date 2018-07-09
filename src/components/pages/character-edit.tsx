import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import { FormState, Decorator, getIn } from 'final-form';
import { Form, Field, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Character, CharacterParams, AttributeParams, AttributeParamsData, SkillParams, DataCollector, Profile, Attribute, Skill, EvaluationChain, buildResolver, buildEvaluator, buildValidator } from "models/status";
import { generateUUID, throttle } from "models/utility";
import { State, Dispatch } from "redux/store";
import { getDataProvider } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";
import { loadStatus } from "components/functions/status-loader";
import { EvaluationProvider } from "components/functions/evaluation";
import { Button, SubmitButton } from "components/atoms/button";
import { AttributeParamsEdit } from "components/organisms/attribute-params-edit";
import { SkillParamsEdit, SkillParamsEditValue } from "components/organisms/skill-params-edit";
import { Page } from "components/templates/page";
import style from "styles/pages/character-edit.scss";

interface CharacterEditPageInternalProps {
	character?: Character;
	profile?: Profile;
	attributes: ReadonlyArray<Attribute>,
	skills: ReadonlyArray<Skill>,
	dispatcher: StatusDispatcher;
	history: History;
}

interface FormValues {
	chain: EvaluationChain;
	attributes: AttributeParamsData;
	skills: SkillParamsEditValue;
}

const EMPTY_ARRAY = [] as any[];
const mapStateToProps = (state: State) => {
	const provider = getDataProvider(state);
	const collector = new DataCollector(provider);
	const profile = provider.profile.default;
	if (profile) {
		const result = collector.resolveProfile(profile.uuid);
		if (result.status) {
			const { attributes, skills } = result.value;
			return { provider, profile, attributes, skills };
		}
	}

	return { provider, profile, attributes: EMPTY_ARRAY, skills: EMPTY_ARRAY };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
}

const mergeProps = (stateProps: ReturnType<typeof mapStateToProps>, dispatchProps: ReturnType<typeof mapDispatchToProps>, ownProps: RouteComponentProps<{ uuid?: string }>) => {
	const { provider, profile, attributes, skills } = stateProps;
	const { dispatcher } = dispatchProps;
	const { history, match: { params: { uuid } } } = ownProps;
	const character = uuid && provider.character.get(uuid);
	return { character, profile, attributes, skills, dispatcher, history };
}

class CharacterEditPageInternal extends React.Component<CharacterEditPageInternalProps> {
	private decorators: Decorator[];

	public constructor(props: CharacterEditPageInternalProps) {
		super(props);

		this.decorators = [this.createEvaluationDecorator()];
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { attributes, skills } = this.props;
		const initialValues = this.makeInitialValues();

		return <Page id="character-edit" heading={<h2>キャラクター編集</h2>}>
			<Form initialValues={initialValues}
				decorators={this.decorators}
				mutators={{ ...arrayMutators }}
				subscription={{}}
				onSubmit={this.handleSubmit}
				render={({ handleSubmit }) =>
					<form className={style['entry']} onSubmit={handleSubmit}>
						<Field name="chain" subscription={{ value: true }} render={({ input: { value } }) =>
							<EvaluationProvider value={value}>
								<section className={style['attributes']}>
									<header><h3>能力値</h3></header>
									<AttributeParamsEdit name="attributes" attributes={attributes} />
								</section>
								<section className={style['skills']}>
									<header><h3>技能</h3></header>
									<SkillParamsEdit name="skills" skills={skills} />
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
							</EvaluationProvider>
						} />
					</form>
				} />
		</Page>
	}

	private handleSubmit(values: object): Promise<void> {
		const { attributes, skills } = values as FormValues;
		const attribute = AttributeParams.from(attributes);
		const skill = new SkillParams(skills.reduce((map, { id, points }) => map.set(id, points), new Map<string, number>()));
		const params = new CharacterParams({ attribute, skill });

		return this.saveCharacter(params).then(() => this.toCharacterManagementPage());
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.toCharacterManagementPage();
	}

	private buildChain(params: CharacterParams) {
		const { attributes, skills } = this.props;
		const resolver = buildResolver({ attributes, skills });
		const evaluator = buildEvaluator({ params });
		const validator = buildValidator({ attribute: true, skill: true });

		return new EvaluationChain({ resolver, evaluator, validator });
	}

	private makeInitialValues(): FormValues {
		const { character } = this.props;
		if (character !== undefined) {
			const params = character.params;
			const chain = this.buildChain(params);
			const attributes = params.attribute.toJSON() || {};
			const skills = Object.entries(params.skill.toJSON()).map(([id, points]) => ({ id, points }));

			return { chain, attributes, skills };
		}

		return this.makeEmptyValues();
	}

	private makeEmptyValues(): FormValues {
		return {
			chain: this.buildChain(new CharacterParams({})),
			attributes: Object.create(null),
			skills: [],
		};
	}

	private createEvaluationDecorator(): Decorator {
		return form => {
			let prev = {};
			return form.subscribe(throttle(250, (state: FormState) => {
				const values = state.values as FormValues;

				if (["attributes", "skills"].some(key => getIn(values, key) !== getIn(prev, key))) {
					const attribute = AttributeParams.from(values.attributes);
					const skill = new SkillParams(values.skills.reduce((map, { id, points }) => map.set(id, points), new Map<string, number>()));
					const params = new CharacterParams({ attribute, skill });
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
		const { character: target, profile, dispatcher } = this.props;
		if (profile) {
			const character = new Character({
				uuid: target ? target.uuid : generateUUID(),
				profile: profile.uuid,
				history: null,
				params,
			});

			if (!target) {
				await dispatcher.character.create(character);
			} else {
				await dispatcher.character.update(character);
			}
		}
	}
}

const Connected = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CharacterEditPageInternal);
const WithRouter = withRouter(Connected);
const StatusReady = loadStatus(WithRouter);

export const CharacterEditPage = StatusReady;