import React from 'react';
import { StatusLoader, StatusLoadState } from "../decorators/status-loader";
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
				state => {
					switch (state) {
						case StatusLoadState.Loading:
							return <Center className={style['container']}>
								<Spinner className={style['spinner']} />
							</Center>
						case StatusLoadState.Done:
							return children();
						case StatusLoadState.Error:
							return <Center className={style['container']}>
								<div className={style['hint']}>
									<p>データのロードに失敗しました。</p>
									<p>IndexedDB非対応ブラウザ、<br />あるいはプライベートモードの可能性があります。</p>
								</div>
							</Center>
					}
				}
			}
		</StatusLoader>
	}
}