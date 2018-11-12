import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from "components/shared/templates/page";
import { author, version, license } from "project/package.json";
import style from "./template.scss";

export interface HomeTemplateProps {
	summary: React.ComponentType;
	caveat: React.ComponentType;
}

export function HomeTemplate({ summary, caveat }: HomeTemplateProps) {
	return <Page heading="クトゥルフTRPG ツール β" pageTitle={false}>
		<div className={style['content']}>
			<Section heading="SUMMARY" sub="概要" content={summary} />
			<Section heading="CAVEAT" sub="注意事項" content={caveat} />
			<Section heading="APP INFO" sub="アプリ情報" content={AppInfo} />
		</div>
	</Page>
}

function Section({ heading, sub, content: Content }: { heading: string, sub: string, content: React.ComponentType }) {
	return <section>
		<h3 className={style['heading']}>
			<span>{heading}</span>
			<span className={style['sub']}>{sub}</span>
		</h3>
		<Content />
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