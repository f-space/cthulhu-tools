import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from "redux/store";
import { LoadState } from "redux/states/status";
import { getLoadState } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";

export interface StatusLoaderProps {
	state: LoadState;
	dispatcher: StatusDispatcher;
}

export class StatusLoader extends React.Component<StatusLoaderProps> {
	public componentWillMount(): void {
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

const ReduxStatusLoader = connect(mapStateToProps, mapDispatchToProps)(StatusLoader);

export default ReduxStatusLoader;

export function loadState<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
	return function (props: P) {
		return <ReduxStatusLoader>
			<Component {...props} />
		</ReduxStatusLoader>
	}
}