import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Status } from "models/status";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Carousel, CarouselView, CarouselContext } from "components/shared/layouts/carousel";
import { Page, Navigation } from "components/shared/templates/page";
import { Dots } from "./dots";
import { AttributeSection } from "./attribute-section";
import { SkillSection } from "./skill-section";
import style from "./template.scss";

export interface StatusTemplateProps {
	statusList: Status[];
}

const NAVS: Navigation[] = [
	{
		to: "/status/character-management",
		icon: "list",
	}
];

const CACHE = new WeakMap<Status, React.ReactNode>();

export class StatusTemplate extends React.Component<StatusTemplateProps> {
	public render() {
		const { statusList } = this.props;

		return <Page id="status" heading="ステータス" navs={NAVS}>
			<Carousel models={statusList} wrap={true}>
				{
					context => <div className={style['container']}>
						<CarouselView
							className={style['list']}
							context={context}
							spring={{ maxIteration: 1 }}
							render={status => this.renderStatusWithCache(status)} />
						{context.models.length !== 0 && this.renderPager(context)}
					</div>
				}
			</Carousel>
		</Page>
	}

	private renderStatusWithCache(status: Status) {
		let result = CACHE.get(status);
		if (result === undefined) {
			result = this.renderStatus(status);
			CACHE.set(status, result);
		}

		return result;
	}

	private renderStatus(status: Status) {
		const chain = status.chain;
		const hash = status.current;

		return <EvaluationProvider chain={chain}>
			<section className={style['status']}>
				<h3 className={style['name']}><EvaluationText target="@attr:name" hash={hash} /></h3>
				<AttributeSection status={status} />
				<SkillSection status={status} />
			</section>
		</EvaluationProvider>
	}

	private renderPager(context: CarouselContext<unknown>) {
		return <div className={style['pager']}>
			<button className={classNames(style['shift'], style['prev'])} type="button" onClick={() => context.shift(-1)}>
				<FontAwesomeIcon icon="chevron-circle-left" size="2x" />
			</button>
			<div className={style['indicator']}>
				<Dots length={context.models.length} index={context.index} />
			</div>
			<button className={classNames(style['shift'], style['next'])} type="button" onClick={() => context.shift(1)}>
				<FontAwesomeIcon icon="chevron-circle-right" size="2x" />
			</button>
		</div>
	}
}