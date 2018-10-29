import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Status, Commit } from "models/status";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Section } from "./section";
import style from "./history-section.scss";

export interface HistorySectionProps {
	status: Status;
	edit: boolean;
	onDelete: (target: Commit) => void;
}

export function HistorySection({ status, edit, onDelete }: HistorySectionProps) {
	const history = status.context.history;

	return <Section heading="履歴">
		<ul className={style['history']}>
			{
				history && [...history.trace()].map(commit =>
					<li key={commit.hash} className={style['event']}>
						<div className={style['message']}>
							{commit.message || "<no message>"}
							{summarize(commit)}
						</div>
						{
							edit && <div className={style['delete']}>
								<button className={style['delete-button']} type="button" onClick={() => onDelete(commit)}>
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

function summarize(commit: Commit): React.ReactNode {
	return <span className={style['summary']}>
		{
			commit.operations.map((op, n) => {
				return <span key={n} className={style['property']}>
					{`<${op.target}>`}
					<EvaluationText target={op.target} hash={commit.parent} />
					{"\u2192"}
					<EvaluationText target={op.target} hash={commit.hash} />
				</span>
			})
		}
	</span>
}