import React from 'react';
import { Evaluation, EvaluationProps } from "components/functions/evaluation";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface EvaluationTextProps extends Omit<EvaluationProps, 'children'> { }

export default function EvaluationText(props: EvaluationTextProps) {
	return <Evaluation {...props}>
		{
			(value, complete) =>
				complete
					? (value !== undefined ? String(value) : "-")
					: "\u2026"
		}
	</Evaluation>
}