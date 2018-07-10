import { connect } from 'react-redux';
import { DataCollector, Status } from "models/status";
import IDBCache from "models/idb-cache";
import { State } from "redux/store";
import { getDataProvider } from "redux/selectors/status";
import { loadStatus } from "components/functions/status-loader";
import { StatusTemplate } from "components/templates/status";

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
	return { provider, statusList };
};

const Connected = connect(mapStateToProps)(StatusTemplate);
const StatusReady = loadStatus(Connected);

export const StatusPage = StatusReady;