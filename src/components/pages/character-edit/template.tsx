import React from 'react';
import { History } from 'history';
import { FormState, Decorator, getIn } from 'final-form';
import { Form, Field, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Character, CharacterParams, AttributeParams, AttributeParamsData, SkillParams, Profile, Attribute, Skill, EvaluationChain, buildResolver, buildEvaluator, buildValidator } from "models/status";
import { generateUUID, throttle } from "models/utility";
import StatusDispatcher from "redux/dispatchers/status";
import { Resolver } from "components/shared/decorators/resolver";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { Button, SubmitButton } from "components/shared/widgets/button";
import { Page } from "components/shared/templates/page";
import { AttributeParamsEdit } from "./attribute-params-edit";
import { SkillParamsEdit, SkillParamsEditValue } from "./skill-params-edit";
import style from "./template.scss";

export interface CharacterEditTemplateProps {
	target?: Character;
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

export class CharacterEditTemplate extends React.Component<CharacterEditTemplateProps> {
	private decorators: Decorator[];

	public constructor(props: CharacterEditTemplateProps) {
		super(props);

		this.decorators = [this.createEvaluationDecorator()];
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { attributes, skills } = this.props;
		const initialValues = this.makeInitialValues();

		return <Page id="character-edit" heading="キャラクター編集">
			<Form initialValues={initialValues}
				decorators={this.decorators}
				mutators={{ ...arrayMutators }}
				subscription={{}}
				onSubmit={this.handleSubmit}
				render={({ handleSubmit }) =>
					<form onSubmit={handleSubmit}>
						<Field name="chain" subscription={{ value: true }} render={({ input: { value } }) =>
							<Resolver.Provider value={value.resolver}>
								<EvaluationProvider chain={value}>
									<section className={style['section']}>
										<AttributeParamsEdit name="attributes" attributes={attributes} />
									</section>
									<section className={style['section']}>
										<h3 className={style['heading']}>技能</h3>
										<SkillParamsEdit name="skills" skills={skills} />
									</section>
									<div className={style['actions']}>
										<FormSpy subscription={{ valid: true, submitting: true }} render={({ valid, submitting }) =>
											<SubmitButton className={style['ok']} disabled={!valid || submitting} commit>OK</SubmitButton>
										} />
										<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
									</div>
								</EvaluationProvider>
							</Resolver.Provider>
						} />
					</form>
				} />
		</Page>
	}

	private handleSubmit(values: object): Promise<void> {
		const { attributes = {}, skills } = values as FormValues;
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
		const { target } = this.props;
		if (target !== undefined) {
			const params = target.params;
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
					const { attributes = {}, skills } = values as FormValues;
					const attribute = AttributeParams.from(attributes);
					const skill = new SkillParams(skills.reduce((map, { id, points }) => map.set(id, points), new Map<string, number>()));
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
		const { target, profile, dispatcher } = this.props;
		if (profile) {
			const character = new Character({
				uuid: target ? target.uuid : generateUUID(),
				profile: profile.uuid,
				history: target ? target.history : null,
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