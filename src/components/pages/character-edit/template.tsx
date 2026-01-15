import React, { useMemo, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { Form, FormSpy } from 'react-final-form';
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
	attributes: readonly Attribute[];
	skills: readonly Skill[];
	dispatcher: StatusDispatcher;
}

interface FormValues {
	attributes?: AttributeParamsData;
	skills: SkillParamsEditValue;
}

export function CharacterEditTemplate(props: CharacterEditTemplateProps) {
	const { target, profile, attributes, skills, dispatcher } = props;

	const [chain, setChain] = useState(initChain(target, attributes, skills));

	const initialValues = useMemo(() => makeInitialValues(target), [target]);
	const mutators = { ...arrayMutators };

	const navigate = useNavigate();
	const handleChange = makeChangeHandler(setChain, attributes, skills);
	const handleSubmit = makeSubmitHandler(dispatcher, target, profile, navigate);
	const handleCancel = makeCancelHandler(navigate);

	const heading = target ? "キャラクター編集" : "キャラクター作成";

	return <Page heading={heading} pageTitle>
		<Form
			initialValues={initialValues}
			mutators={mutators}
			subscription={{}}
			onSubmit={handleSubmit}
			render={({ handleSubmit }) =>
				<form onSubmit={handleSubmit}>
					<FormSpy subscription={{ values: true }} onChange={handleChange} />
					<Resolver.Provider value={chain.resolver}>
						<EvaluationProvider chain={chain}>
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
								<Button className={style['cancel']} onClick={handleCancel}>Cancel</Button>
							</div>
						</EvaluationProvider>
					</Resolver.Provider>
				</form>
			} />
	</Page>;
}

function initChain(target: Character | undefined, attributes: readonly Attribute[], skills: readonly Skill[]) {
	return buildChain(
		attributes,
		skills,
		target !== undefined ? target.params : new CharacterParams({}),
	);
}

function buildChain(attributes: readonly Attribute[], skills: readonly Skill[], params: CharacterParams) {
	const resolver = buildResolver({ attributes, skills });
	const evaluator = buildEvaluator({ params });
	const validator = buildValidator({ attribute: true, skill: true });
	return new EvaluationChain({ resolver, evaluator, validator });
}

function makeInitialValues(target: Character | undefined) {
	if (target !== undefined) {
		const { params } = target;
		const attributes = params.attribute.toJSON();
		const skills = Object.entries(params.skill.toJSON()).map(([id, points]) => ({ id, points }));
		return { attributes, skills };
	} else {
		return {
			attributes: Object.create(null),
			skills: [],
		};
	}
}

function makeChangeHandler(updateFn: (chain: EvaluationChain) => void, attributes: readonly Attribute[], skills: readonly Skill[]) {
	return throttle(
		250,
		({ values }: { values?: FormValues; }) => {
			const params = makeCharacterParams(values!);
			const chain = buildChain(attributes, skills, params);
			updateFn(chain);
		},
	);
}

function makeSubmitHandler(dispatcher: StatusDispatcher, target: Character | undefined, profile: Profile | undefined, navigate: NavigateFunction) {
	if (profile) {
		return async (values: FormValues) => {
			const params = makeCharacterParams(values);
			if (target) {
				await updateCharacter(dispatcher, target, profile, params);
			} else {
				await createCharacter(dispatcher, profile, params);
			}
			toCharacterManagementPage(navigate);
		};
	} else {
		return () => Promise.resolve();
	}
}

function makeCancelHandler(navigate: NavigateFunction) {
	return () => {
		toCharacterManagementPage(navigate);
	};
}

function makeCharacterParams(values: FormValues) {
	const { attributes = {}, skills } = values;
	const attribute = AttributeParams.from(attributes);
	const skill = new SkillParams(skills.reduce((map, { id, points }) => map.set(id, points), new Map<string, number>()));
	return new CharacterParams({ attribute, skill });
}

function createCharacter(dispatcher: StatusDispatcher, profile: Profile, params: CharacterParams) {
	return dispatcher.character.create(
		new Character({
			uuid: generateUUID(),
			profile: profile.uuid,
			history: null,
			params,
		}),
	);
}

function updateCharacter(dispatcher: StatusDispatcher, target: Character, profile: Profile, params: CharacterParams) {
	return dispatcher.character.update(
		new Character({
			uuid: target.uuid,
			profile: profile.uuid,
			history: target.history,
			params,
		}),
	);
}

function toCharacterManagementPage(navigate: NavigateFunction) {
	navigate("/status/character-management");
}
