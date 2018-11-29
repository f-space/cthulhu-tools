import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { State, Dispatch } from "redux/store";
import ConfigDispatcher from "redux/dispatchers/config";
import { getMuted } from "redux/selectors/config";
import style from "./menu.scss";

export interface MenuProps extends React.HTMLAttributes<HTMLElement> { }

interface MenuInnerProps extends MenuProps {
	muted: boolean;
	dispatcher: ConfigDispatcher;
}

function MenuInner(props: MenuInnerProps) {
	const { className, muted, dispatcher, ...rest } = props;

	return <div {...rest} className={classNames(className, style['menu'])}>
		<div
			className={classNames(style['icon'], { [style['muted']]: muted })}
			role="button"
			aria-pressed={muted}
			aria-label="ミュート"
			onClick={() => dispatcher.mute(!muted)}>
			{
				muted
					? <FontAwesomeIcon icon="volume-mute" />
					: <FontAwesomeIcon icon="volume-up" />
			}
		</div>
	</div>
}

const mapStateToProps = (state: State) => {
	return { muted: getMuted(state) };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return { dispatcher: new ConfigDispatcher(dispatch) };
};

export const Menu = connect(mapStateToProps, mapDispatchToProps)(MenuInner);
