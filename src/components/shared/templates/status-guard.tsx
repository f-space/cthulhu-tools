import React from 'react';
import { StatusLoader, StatusLoadState, StatusLoadError } from "../decorators/status-loader";
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
				(state, error) => {
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
									{this.renderError(error)}
								</div>
							</Center>
					}
				}
			}
		</StatusLoader>
	}

	private renderError(error: StatusLoadError) {
		switch (error) {
			case StatusLoadError.None: return null;
			case StatusLoadError.Network:
				return <>
					<p>サーバーからのデータ読み込みに失敗しました。</p>
					<p>ネットワークに接続されていないか、<br />サーバーが応答していない可能性があります。</p>
				</>
			case StatusLoadError.IndexedDB:
				return <>
					<p>IndexdDBからのデータ読み込みに失敗しました。</p>
					<p>IndexedDB非対応ブラウザ、<br />あるいはプライベートモードの可能性があります。</p>
				</>
		}
	}
}