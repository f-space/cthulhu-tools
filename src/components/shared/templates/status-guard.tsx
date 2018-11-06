import React from 'react';
import { StatusLoader } from "../decorators/status-loader";
import { Center } from "../layouts/center";
import { Spinner } from "../widgets/spinner";
import style from "./status-guard.scss";

export interface StatusGuardProps {
	children: () => React.ReactNode;
}

export class StatusGuard extends React.Component<StatusGuardProps> {
	public render() {
		const { children } = this.props;

		return <StatusLoader>
			{
				loaded => loaded
					? children()
					: <Center className={style['container']}>
						<Spinner className={style['spinner']} />
					</Center>
			}
		</StatusLoader>
	}
}