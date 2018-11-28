import React from 'react';
import { Link } from 'react-router-dom';
import { InstallPrompt } from "components/shared/decorators/install-prompt";
import { Button } from "components/shared/widgets/button";
import { Page } from "components/shared/templates/page";
import { author, version, license } from "project/package.json";
import Summary from "./summary.jsx.pug";
import Caveat from "./caveat.jsx.pug";
import style from "./template.scss";

export interface HomeTemplateProps { }

export function HomeTemplate() {
	return <Page heading="クトゥルフTRPG ツール β" pageTitle={false}>
		<div className={style['content']}>
			<Section heading="SUMMARY" sub="概要"><Summary /></Section>
			<Section heading="CAVEAT" sub="注意事項"><Caveat /></Section>
			<Section heading="APP INFO" sub="アプリ情報"><AppInfo /></Section>
			<Section heading="INSTALL" sub="インストール"><InstallApp /></Section>
		</div>
	</Page>
}

interface SectionProps {
	heading: string;
	sub: string;
	children: React.ReactNode;
}

function Section({ heading, sub, children }: SectionProps) {
	return <section>
		<h3 className={style['heading']}>
			<span>{heading}</span>
			<span className={style['sub']}>{sub}</span>
		</h3>
		{children}
	</section>
}

function AppInfo() {
	return <dl className={style['app-info']}>
		<dt>開発者</dt>
		<dd>{author}</dd>
		<dt>バージョン</dt>
		<dd>{version}</dd>
		<dt>ライセンス</dt>
		<dd><Link to="/license">{license}</Link></dd>
		<dt>著作権等</dt>
		<dd><Link to="/license">ライセンス</Link> ページ参照</dd>
	</dl>
}

function InstallApp() {
	return <>
		<p>このアプリは端末へのインストールに対応しています。</p>
		<p>インストールの利点は次の通り。</p>
		<ul>
			<li>端末ホーム画面からのアクセス</li>
			<li>ブラウザUI（URLバーなど）の排除</li>
			<li>画面の向きの固定</li>
		</ul>
		<p>インストールによりアプリが特別な権限を得ることはありません。</p>
		<InstallPrompt>
			{
				prompt => prompt
					? <Button className={style['install']} commit onClick={prompt}>アプリのインストール</Button>
					: <p>
						<span>ブラウザのメニューよりホーム画面に追加すると、</span>
						<span>対応ブラウザであればアプリがインストールされます。</span>
						<span>非対応ブラウザではショートカットが作成されます。</span>
					</p>
			}
		</InstallPrompt>
	</>
}