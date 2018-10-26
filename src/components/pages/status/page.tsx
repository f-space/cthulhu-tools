import { connect } from 'react-redux';
import { DataCollector, Status } from "models/status";
import IDBCache from "models/idb-cache";
import { State, Dispatch } from "redux/store";
import StatusDispatcher from 'redux/dispatchers/status';
import { getDataProvider } from "redux/selectors/status";
import { loadStatus } from "components/shared/decorators/status-loader";
import { StatusTemplate } from "./template";

const mapStateToProps = (state: State) => {
	const provider = getDataProvider(state);
	const collector = new DataCollector(provider);
	const { views } = state.status.view;
	const statusList = views.valueSeq()
		.filter(view => view.visible)
		.map(view => collector.resolveCharacter(view.target))
		.filter(DataCollector.isOK)
		.map(result => new Status(result.value, IDBCache))
		.sort(Status.compare)
		.toArray();
	return { statusList };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
};

const Connected = connect(mapStateToProps, mapDispatchToProps)(StatusTemplate);
const StatusReady = loadStatus(Connected);

export const StatusPage = StatusReady;