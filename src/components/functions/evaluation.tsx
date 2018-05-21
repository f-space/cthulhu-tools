import React from 'react';
import { Reference, Expression, EvaluationChain } from "models/status";

const EvaluationContext = React.createContext<EvaluationChain>(new EvaluationChain({}));

export const EvaluationProvider = EvaluationContext.Provider;

export interface EvaluationProps {
	id?: string;
	modifier?: string | null;
	reference?: Reference;
	expression?: string;
	hash: string | null;
	children: (value: any, complete: boolean) => React.ReactNode;
}

export function Evaluation(props: EvaluationProps) {
	return <EvaluationContext.Consumer>
		{value => <EvaluationInternal {...props} chain={value} />}
	</EvaluationContext.Consumer>
}

interface EvaluationInternalProps extends EvaluationProps {
	chain: EvaluationChain;
}

interface EvaluationInternalState {
	complete: boolean;
	value: any;
}

class EvaluationInternal extends React.Component<EvaluationInternalProps, EvaluationInternalState> {
	private timer?: number;

	public constructor(props: EvaluationInternalProps) {
		super(props);

		this.state = { complete: false, value: undefined };
	}

	public componentDidMount(): void {
		this.updateValue();
	}

	public componentWillUnmount(): void {
		this.stopTask();
	}

	public componentDidUpdate(prevProps: EvaluationInternalProps): void {
		if (!this.isEqual(this.props, prevProps)) {
			this.updateValue();
		}
	}

	public render() {
		const { children } = this.props;
		const { complete, value } = this.state;

		return children(value, complete);
	}

	private isEqual(a: EvaluationInternalProps, b: EvaluationInternalProps): boolean {
		return a.id === b.id
			&& a.modifier === b.modifier
			&& a.reference === b.reference
			&& a.expression === b.expression
			&& a.hash === b.hash
			&& a.chain === b.chain;
	}

	private updateValue(): void {
		this.setState({ complete: false, value: undefined });
		this.startTask(() => {
			const value = this.evaluate();
			this.setState({ complete: true, value });
		});
	}

	private startTask(callback: () => void): void {
		this.stopTask();
		this.timer = setTimeout(callback, 0) as any;
	}

	private stopTask(): void {
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}
	}

	private evaluate(): any {
		const { id, modifier, reference, expression, hash, chain } = this.props;
		if (id !== undefined) {
			const ref = new Reference(id, modifier);
			return chain.evaluate(ref, hash);
		} else if (reference !== undefined) {
			return chain.evaluate(reference, hash);
		} else if (expression !== undefined) {
			const expr = Expression.parse(expression);
			return expr && chain.evaluateExpression(expr, hash);
		}
		return undefined;
	}
}