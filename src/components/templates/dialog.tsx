import React from 'react';
import classNames from 'classnames';
import { DialogPortal } from "components/frame/dialog";
import style from "styles/templates/dialog.scss";

export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
	when: boolean;
	header: React.ReactNode;
}

export default function Dialog(props: DialogProps) {
	const { when, header, className, children, ...rest } = props;

	if (when) {
		return <DialogPortal>
			<aside {...rest} className={classNames(className, style['dialog'])}>
				<h1 className={style['header']}>{header}</h1>
				<div className={style['content']}>
					{children}
				</div>
			</aside>
		</DialogPortal>
	} else {
		return null;
	}
}