import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Status, Command } from "models/status";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Section } from "./section";
import style from "./history-section.scss";

export interface HistorySectionProps {
	status: Status;
	edit: boolean;
	onDelete: (target: Command) => void;
}

export function HistorySection({ status, edit, onDelete }: HistorySectionProps) {
	const history = status.context.history;

	return <Section heading="履歴">
		<ul className={style['history']}>
			{
				history && [...history.trace()].map(command =>
					<li key={command.hash} className={style['event']}>
						<div className={style['message']}>
							{command.message || "<no message>"}
							{summarize(command)}
						</div>
						{
							edit && <div className={style['delete']}>
								<button className={style['delete-button']} type="button" onClick={() => onDelete(command)}>
									<FontAwesomeIcon icon="trash-alt" />
								</button>
							</div>
						}
					</li>
				)
			}
		</ul>
	</Section>
}

function summarize(command: Command): React.ReactNode {
	return <span className={style['summary']}>
		{
			command.operations.map((op, n) => {
				return <span key={n} className={style['property']}>
					{`<${op.target}>`}
					<EvaluationText target={op.target} hash={command.parent} />
					{"\u2192"}
					<EvaluationText target={op.target} hash={command.hash} />
				</span>
			})
		}
	</span>
}