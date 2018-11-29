import React from 'react';
import { DiceImageStore } from "models/resource";
import { DiceImageLoader, DiceImageLoadState } from "../decorators/dice-image-loader";
import { Center } from "../layouts/center";
import { Spinner } from "../widgets/spinner";
import style from "./dice-image-guard.scss";

const { Provider, Consumer } = React.createContext<DiceImageStore | null>(null);

export interface DiceImageGuardProps {
	children: () => React.ReactNode;
}

export class DiceImageGuard extends React.Component<DiceImageGuardProps> {
	public render() {
		const { children } = this.props;

		return <DiceImageLoader>
			{
				(state, store) => {
					switch (state) {
						case DiceImageLoadState.Loading:
							return <Center className={style['container']}>
								<Spinner className={style['spinner']} />
							</Center>
						case DiceImageLoadState.Done:
							return <Provider value={store!}>{children()}</Provider>;
						case DiceImageLoadState.Error:
							return <Center className={style['container']}>
								<div className={style['hint']}>
									<p>ダイス画像の読み込みに失敗しました。</p>
									<p>ネットワークに接続されていないか、<br />サーバーが応答していない可能性があります。</p>
								</div>
							</Center>
					}
				}
			}
		</DiceImageLoader>
	}
}

export const DiceImageConsumer = Consumer;