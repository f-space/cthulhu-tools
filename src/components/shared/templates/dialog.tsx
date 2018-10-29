import React from 'react';
import classNames from 'classnames';
import DialogComponents from "components/frame/dialog";
import style from "./dialog.scss";

export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
	open: boolean;
	header: React.ReactNode;
	children: () => React.ReactNode;
}

export function Dialog(props: DialogProps) {
	const { open, header, className, children, ...rest } = props;

	if (open) {
		return <DialogComponents.Portal>
			<aside {...rest} className={classNames(className, style['dialog'])}>
				<h1 className={style['header']}>{header}</h1>
				<div className={style['content']}>
					{children()}
				</div>
			</aside>
		</DialogComponents.Portal>
	} else {
		return null;
	}
}