import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from "redux/store";
import { LoadState } from "redux/states/status";
import { getLoadState } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";

interface StatusLoaderInternalProps {
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

		return (state === 'loaded' ? children : null);
	}
}

const mapStateToProps = (state: State) => {
	return { state: getLoadState(state) };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
	return { dispatcher: new StatusDispatcher(dispatch) };
}

export const StatusLoader = connect(mapStateToProps, mapDispatchToProps)(StatusLoaderInternal);

export function loadStatus<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
	return function (props: P) {
		return <StatusLoader>
			<Component {...props} />
		</StatusLoader>
	}
}