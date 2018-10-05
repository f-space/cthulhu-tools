import React from 'react';
import { Evaluation, EvaluationRequester, CancellationHandle, EVALUATION_CANCEL } from "../decorators/evaluation";
import { Reference, Expression } from 'models/status';

const UNDEFINED = "-";
const PENDING = "\u2026";

export type EvaluationMode = 'reference' | 'expression';

export interface EvaluationTextProps {
	target: Reference | Expression | string;
	hash: string | null;
	mode?: EvaluationMode;
}

export function EvaluationText(props: EvaluationTextProps) {
	return <Evaluation>
		{requester => <EvaluationTextInner {...props} requester={requester} />}
	</Evaluation>
}

interface EvaluationTextInnerProps extends EvaluationTextProps {
	requester: EvaluationRequester;
}

class EvaluationTextInner extends React.PureComponent<EvaluationTextInnerProps> {
	private handle!: CancellationHandle;
	private ref = React.createRef<HTMLElement>();

	public componentDidMount(): void {
		this.handle = { canceled: false };

		this.requestEvaluation(this.handle);
	}

	public componentWillUnmount(): void {
		this.handle.canceled = true;
	}

	public componentDidUpdate(): void {
		this.handle.canceled = true;
		this.handle = { canceled: false };

		this.requestEvaluation(this.handle);
	}

	public render() {
		return <span ref={this.ref}>{PENDING}</span>
	}

	private requestEvaluation(handle: CancellationHandle): void {
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

		request.then(value => {
			if (value !== EVALUATION_CANCEL) {
				const element = this.ref.current;
				if (element) {
					element.textContent = value !== undefined ? String(value) : UNDEFINED;
				}
			}
		});
	}
}