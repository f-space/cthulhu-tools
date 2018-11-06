import React from 'react';
import { StatusLoader } from "components/shared/decorators/status-loader";

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
					: null
			}
		</StatusLoader>
	}
}