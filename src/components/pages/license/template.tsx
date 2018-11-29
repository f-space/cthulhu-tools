import React from 'react';
import { Page } from "components/shared/templates/page";
import style from "./template.scss";

const LICENSE_LINKS: { [spdx: string]: string | undefined } = {
	"Apache-2.0": `https://opensource.org/licenses/Apache-2.0`,
	"BSD-3-Clause": `https://opensource.org/licenses/BSD-3-Clause`,
	"CC-BY-4.0": `https://creativecommons.org/licenses/by/4.0/`,
	"GPL-2.0": `https://opensource.org/licenses/GPL-2.0`,
	"MIT": `https://opensource.org/licenses/mit-license.html`,
};

interface LicenseProps {
	license: ReadonlyArray<string>
}

interface AssetProps {
	assets: ReadonlyArray<Asset>;
}

interface LibraryProps {
	libraries: ReadonlyArray<Library>;
}

export interface LicenseTemplateProps extends LicenseProps, AssetProps, LibraryProps { }

export function LicenseTemplate({ license, assets, libraries }: LicenseTemplateProps) {
	return <Page heading="ライセンス" pageTitle>
		<div className={style['content']}>
			<License license={license} />
			<Assets assets={assets} />
			<Libraries libraries={libraries} />
		</div>
	</Page>
}

function License({ license }: LicenseProps) {
	return <section className={style['license']}>
		<h3 className={style['invisible']}>MITライセンス</h3>
		{license.map((text, n) => <p key={n}>{text}</p>)}
	</section>;
}

function Assets(props: AssetProps) {
	return <section className={style['assets']}>
		<h3 className={style['heading']}>アセット一覧</h3>
		<AssetTable {...props} />
	</section>
}

function AssetTable({ assets }: AssetProps) {
	return <table className={style['asset-table']}>
		<thead>
			<tr>
				<th scope="col">アセット名</th>
				<th scope="col">著作権</th>
			</tr>
		</thead>
		<tbody>
			{
				assets.map(({ name, owner, url }) =>
					<tr key={name}>
						<th scope="row"><a href={url} rel="external">{name}</a></th>
						<td>{`© ${owner}`}</td>
					</tr>
				)
			}
		</tbody>
	</table>
}

function Libraries(props: LibraryProps) {
	return <section className={style['libraries']}>
		<h3 className={style['heading']}>ライブラリ一覧</h3>
		<LibraryTable {...props} />
	</section>
}

function LibraryTable({ libraries }: LibraryProps) {
	return <table className={style['library-table']}>
		<thead>
			<tr>
				<th scope="col">パッケージ名</th>
				<th scope="col">著作権</th>
				<th scope="col">ライセンス</th>
			</tr>
		</thead>
		<tbody>
			{
				libraries.map(({ name, owner, licenses }) =>
					<tr key={name}>
						<th scope="row">{name}</th>
						<td>{`© ${owner}`}</td>
						<td><LinkedLicense licenses={licenses} /></td>
					</tr>
				)
			}
		</tbody>
	</table>
}

function LinkedLicense({ licenses }: { licenses: string }) {
	const list = Object.keys(LICENSE_LINKS);
	const separated = list.reduce((s, spdx) => s.replace(spdx, `\x00${spdx}\x00`), licenses);
	const split = separated.split("\x00").filter(s => s);
	return <>
		{
			split.map(token => {
				const url = LICENSE_LINKS[token];
				return url ? <a key={url} href={url} rel="external">{token}</a> : token;
			})
		}
	</>
}