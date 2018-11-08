import React from 'react';
import { Reference, Expression, EvaluationChain } from "models/status";

export const EVALUATION_CANCEL = Symbol("EVALUATION_CANCEL");

export interface CancellationHandle {
	canceled: boolean;
}

export interface EvaluationRequest {
	target: Reference | Expression;
	hash: string | null;
	handle: CancellationHandle;
	callback: (value: any) => void;
}

export class EvaluationRequester {
	private refCache = new Map<string, Reference>();
	private exprCache = new Map<string, Expression>();

	public constructor(readonly callback?: (request: EvaluationRequest) => void) { }

	public request(target: Reference | Expression, hash: string | null, handle: CancellationHandle): Promise<any> {
		return new Promise(resolve => {
			if (this.callback) {
				this.callback({
					target,
					hash,
					handle,
					callback: resolve,
				});
			} else {
				Promise.resolve(undefined);
			}
		});
	}

	public requestAsReference(text: string, hash: string | null, handle: CancellationHandle): Promise<any> {
		const ref = this.convert(text, Reference.parse, this.refCache);

		return ref ? this.request(ref, hash, handle) : Promise.reject(new Error(`'${text}' cannot be parsed as a reference.`));
	}

	public requestAsExpression(text: string, hash: string | null, handle: CancellationHandle): Promise<any> {
		const expr = this.convert(text, Expression.parse, this.exprCache);

		return expr ? this.request(expr, hash, handle) : Promise.reject(new Error(`'${text}' cannot be parsed as an expression.`));
	}

	private convert<T>(text: string, map: (text: string) => T, cache: Map<string, T>): T {
		let value = cache.get(text);
		if (value === undefined) cache.set(text, value = map(text));
		return value;
	}
}

class EvaluationInvoker {
	public readonly requester: EvaluationRequester;
	private requests: EvaluationRequest[];

	public constructor(readonly chain: EvaluationChain, callback: () => void) {
		this.requester = new EvaluationRequester(request => {
			this.requests.push(request);
			callback();
		});
		this.requests = [];
	}

	public empty(): boolean {
		return this.requests.length === 0;
	}

	public next(): void {
		const request = this.requests.shift();
		if (request) {
			const { target, hash, handle, callback } = request;

			let value;
			if (handle.canceled) {
				value = EVALUATION_CANCEL;
			} else if (target instanceof Reference) {
				value = this.chain.evaluate(target, hash);
			} else if (target instanceof Expression) {
				value = this.chain.evaluateExpression(target, hash);
			}

			callback(value);
		}
	}

	public cancel(): void {
		for (const request of this.requests) {
			request.callback(EVALUATION_CANCEL);
		}

		this.requests = [];
	}
}

const EvaluationContext = React.createContext<EvaluationRequester>(new EvaluationRequester());

export const Evaluation = EvaluationContext.Consumer;

export interface EvaluationProviderProps {
	chain: EvaluationChain;
	limit: number;
}

interface EvaluationProviderState {
	invoker: EvaluationInvoker;
}

export class EvaluationProvider extends React.Component<EvaluationProviderProps, EvaluationProviderState> {
	public static readonly defaultProps = {
		limit: 10,
	};

	private timer?: number;

	public constructor(props: EvaluationProviderProps) {
		super(props);

		this.state = { invoker: this.createInvoker(props.chain) };
	}

	public componentWillUnmount(): void {
		this.state.invoker.cancel();

		this.cancel();
	}

	public componentDidUpdate(prevProps: EvaluationProviderProps, prevState: EvaluationProviderState): void {
		if (this.state.invoker !== prevState.invoker) {
			prevState.invoker.cancel();
		}
		if (this.props.chain !== prevProps.chain) {
			this.setState({ invoker: this.createInvoker(this.props.chain) });
		}
	}

	public render() {
		return <EvaluationContext.Provider value={this.state.invoker.requester}>
			{this.props.children}
		</EvaluationContext.Provider>
	}

	private createInvoker(chain: EvaluationChain): EvaluationInvoker {
		return new EvaluationInvoker(chain, this.start.bind(this));
	}

	private start(): void {
		if (this.timer === undefined) {
			this.timer = this.next();
		}
	}

	private cancel(): void {
		if (this.timer !== undefined) {
			window.clearTimeout(this.timer);
			this.timer = undefined;
		}
	}

	private next(startTime: number = performance.now()): number {
		return window.setTimeout(() => {
			const { invoker } = this.state;
			const endTime = startTime + this.props.limit;
			while (performance.now() < endTime && !invoker.empty()) {
				invoker.next();
			}

			this.timer = !invoker.empty() ? this.next() : undefined;
		}, 0);
	}
}