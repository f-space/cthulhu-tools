import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Profile, Attribute, Skill, DataProvider, DataCollector } from "models/status";
import { State, Dispatch } from "redux/store";
import { getDataProvider } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";
import { DiceImageGuard } from "components/shared/templates/dice-image-guard";
import { StatusGuard } from "components/shared/templates/status-guard";
import { CharacterEditTemplate, CharacterEditTemplateProps } from "./template";

interface StateProps {
	provider: DataProvider;
	profile?: Profile;
	attributes: ReadonlyArray<Attribute>;
	skills: ReadonlyArray<Skill>;
}

interface DispatchProps {
	dispatcher: StatusDispatcher;
}

interface OwnProps extends RouteComponentProps<{ uuid?: string }> { }

const EMPTY_ARRAY = [] as any[];
function mapStateToProps(state: State): StateProps {
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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: OwnProps): CharacterEditTemplateProps {
	const { provider, profile, attributes, skills } = stateProps;
	const { dispatcher } = dispatchProps;
	const { history, match: { params: { uuid } } } = ownProps;
	const target = uuid !== undefined ? provider.character.get(uuid) : undefined;
	return { target, profile, attributes, skills, dispatcher, history };
}

const Connected = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CharacterEditTemplate);

export function CharacterEditPage(props: RouteComponentProps<{ uuid?: string }>) {
	return <DiceImageGuard>
		{
			() => <StatusGuard>
				{() => <Connected {...props} />}
			</StatusGuard>
		}
	</DiceImageGuard>
}