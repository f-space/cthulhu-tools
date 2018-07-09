import React from 'react';
import classNames from 'classnames';
import DialogComponents from "components/frame/dialog";
import style from "styles/dialogs/shared/dialog.scss";

export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
	when: boolean;
	header: React.ReactNode;
}

export function Dialog(props: DialogProps) {
	const { when, header, className, children, ...rest } = props;

	if (when) {
		return <DialogComponents.Portal>
			<aside {...rest} className={classNames(className, style['dialog'])}>
				<h1 className={style['header']}>{header}</h1>
				<div className={style['content']}>
					{children}
				</div>
			</aside>
		</DialogComponents.Portal>
	} else {
		return null;
	}
}