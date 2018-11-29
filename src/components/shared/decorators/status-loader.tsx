import React from 'react';
import { connect } from 'react-redux';
import { State, Dispatch } from "redux/store";
import { LoadState, LoadError } from "redux/states/status";
import { getLoadState, getLoadError } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";

export enum StatusLoadState {
	Loading,
	Done,
	Error,
}

export enum StatusLoadError {
	None,
	Network,
	IndexedDB,
}

export interface StatusLoaderProps {
	children: (state: StatusLoadState, error: StatusLoadError) => React.ReactNode;
}

function toStatusLoadState(state: LoadState): StatusLoadState {
	switch (state) {
		case 'unloaded': return StatusLoadState.Loading;
		case 'loading': return StatusLoadState.Loading;
		case 'loaded': return StatusLoadState.Done;
		case 'error': return StatusLoadState.Error;
	}
}

function toStatusLoadError(error: LoadError): StatusLoadError {
	switch (error) {
		case '': return StatusLoadError.None;
		case 'network': return StatusLoadError.Network;
		case 'indexeddb': return StatusLoadError.IndexedDB;
	}
}

interface StatusLoaderInternalProps extends StatusLoaderProps {
	state: LoadState;
	error: LoadError;
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
		const { state, error, children } = this.props;

		return children(toStatusLoadState(state), toStatusLoadError(error));
	}
}

const mapStateToProps = (state: State) => {
	return {
		state: getLoadState(state),
		error: getLoadError(state),
	};
}

const mapDispatchToProps = (dispatch: Dispatch) => {
	return { dispatcher: new StatusDispatcher(dispatch) };
}

export const StatusLoader = connect(mapStateToProps, mapDispatchToProps)(StatusLoaderInternal);