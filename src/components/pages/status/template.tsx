import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Status } from "models/status";
import StatusDispatcher from "redux/dispatchers/status";
import { Carousel, CarouselView, CarouselContext } from "components/shared/layouts/carousel";
import { Page, Navigation } from "components/shared/templates/page";
import { Dots } from "./dots";
import { StatusView } from "./status-view";
import style from "./template.scss";

export interface StatusTemplateProps {
	statusList: Status[];
	dispatcher: StatusDispatcher;
}

interface StatusTemplateState {
	edit: boolean;
}

const NAVS: Navigation[] = [
	{
		to: "/status/character-management",
		label: "キャラクター管理",
		icon: "list",
	}
];

const CACHE = new WeakMap<Status, React.ReactNode>();

export class StatusTemplate extends React.Component<StatusTemplateProps, StatusTemplateState> {
	public constructor(props: StatusTemplateProps) {
		super(props);

		this.state = { edit: false };
		this.handleEditClick = this.handleEditClick.bind(this);
	}

	public render() {
		const { statusList, dispatcher } = this.props;
		const { edit } = this.state;

		return <Page heading="ステータス" navs={NAVS} pageTitle>
			<Carousel models={statusList} wrap={true}>
				{
					context => <div className={style['container']}>
						<CarouselView
							className={style['list']}
							context={context}
							spring={{ maxIteration: 1 }}
							render={status => <StatusView status={status} edit={edit} dispatcher={dispatcher} />} />
						{context.models.length !== 0 && this.renderCommands()}
						{context.models.length !== 0 && this.renderPager(context)}
					</div>
				}
			</Carousel>
		</Page>
	}

	private renderCommands() {
		const { edit } = this.state;

		return <div className={style['track']}>
			<div className={style['commands']}>
				<button className={classNames(style['command'], { [style['active']]: edit })} type="button" onClick={this.handleEditClick}>
					<FontAwesomeIcon icon="edit" />
				</button>
			</div>
		</div>
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

	private handleEditClick(): void {
		this.setState(state => ({ edit: !state.edit }));
	}
}