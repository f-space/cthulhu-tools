import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from "redux/store";
import { LoadState } from "redux/states/status";
import { getLoadState } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";

export interface StatusLoaderProps {
	children: (loaded: boolean) => React.ReactNode;
}

interface StatusLoaderInternalProps extends StatusLoaderProps {
	state: LoadState;
	dispatcher: StatusDispatcher;
}

class StatusLoaderInternal extends React.Component<StatusLoaderInternalProps> {
	public componentDidMount(): void {
		const { state, dispatcher } = this.props;

		if (state === 'unloaded') {
			dispatcher.load();
		}
	}

	public render() {
		const { state, children } = this.props;

		return children(state === 'loaded');
	}
}

const mapStateToProps = (state: State) => {
	return { state: getLoadState(state) };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
	return { dispatcher: new StatusDispatcher(dispatch) };
}

export const StatusLoader = connect(mapStateToProps, mapDispatchToProps)(StatusLoaderInternal);