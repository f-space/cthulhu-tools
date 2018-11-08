import React from 'react';
import { Evaluation, EvaluationRequester, CancellationHandle, EVALUATION_CANCEL } from "./evaluation";
import { Reference, Expression } from 'models/status';

export type EvaluationMode = 'reference' | 'expression';

export interface EvaluationAsyncProps {
	target: Reference | Expression | string;
	hash: string | null;
	mode?: EvaluationMode;
	children: (value?: [any]) => React.ReactNode;
}

export function EvaluationAsync(props: EvaluationAsyncProps) {
	return <Evaluation>
		{requester => <EvaluationAsyncInner {...props} requester={requester} />}
	</Evaluation>
}

interface EvaluationAsyncInnerProps extends EvaluationAsyncProps {
	requester: EvaluationRequester;
}

class EvaluationAsyncInner extends React.PureComponent<EvaluationAsyncInnerProps> {
	private handle: CancellationHandle = { canceled: false };

	public componentWillUnmount(): void {
		this.handle.canceled = true;
	}

	public render() {
		this.handle.canceled = true;
		this.handle = { canceled: false };

		return <Async value={this.requestEvaluation(this.handle)}>
			{this.props.children}
		</Async>
	}

	private requestEvaluation(handle: CancellationHandle): Promise<any> {
		const { requester, target, hash, mode = 'reference' } = this.props;

		let request: Promise<any>;
		if (typeof target === 'string') {
			switch (mode) {
				case 'reference': request = requester.requestAsReference(target, hash, handle); break;
				case 'expression': request = requester.requestAsExpression(target, hash, handle); break;
				default: throw new Error('Unknown evaluation mode.');
			}
		} else {
			request = requester.request(target, hash, handle);
		}

		return request
	}
}

interface AsyncProps {
	value: Promise<any>;
	children: (value?: [any]) => React.ReactNode;
}

interface AsyncState {
	value?: [any];
}

class Async extends React.Component<AsyncProps, AsyncState> {
	public state: AsyncState = {};

	public componentDidMount() {
		this.requestUpdate(this.props.value);
	}

	public componentDidUpdate(prevProps: AsyncProps) {
		if (this.props.value !== prevProps.value) {
			this.requestUpdate(this.props.value);
		}
	}

	public render() {
		return this.props.children(this.state.value);
	}

	private requestUpdate(promise: Promise<any>): void {
		this.setState({ value: undefined });
		promise.then(value => {
			if (value !== EVALUATION_CANCEL) {
				this.setState({ value: [value] });
			}
		});
	}
}
