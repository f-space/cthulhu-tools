import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { DataProvider, DataCollector, Status } from "models/status";
import IDBCache from "models/idb-cache";
import { State, Dispatch } from "redux/store";
import { getDataProvider } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";
import { StatusGuard } from "components/shared/templates/status-guard";
import { CharacterManagementTemplate, CharacterManagementTemplateProps } from "./template";

interface StateProps {
	provider: DataProvider;
	statusList: Status[];
}

interface DispatchProps {
	dispatcher: StatusDispatcher;
}

interface OwnProps extends RouteComponentProps { }

function mapStateToProps(state: State): StateProps {
	const provider = getDataProvider(state);
	const collector = new DataCollector(provider);
	const { views } = state.status.view;
	const statusList = views.valueSeq()
		.map(view => collector.resolveCharacter(view.target))
		.filter(DataCollector.isOK)
		.map(result => new Status(result.value, IDBCache))
		.sort(Status.compare)
		.toArray();
	return { provider, statusList };
};

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
};

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: OwnProps): CharacterManagementTemplateProps {
	const { history } = ownProps;
	return { ...stateProps, ...dispatchProps, history };
}

const Connected = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CharacterManagementTemplate);

export function CharacterManagementPage(props: RouteComponentProps) {
	return <StatusGuard>
		{() => <Connected {...props} />}
	</StatusGuard>
};