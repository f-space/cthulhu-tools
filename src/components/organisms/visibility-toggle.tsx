import React from 'react';
import { connect } from 'react-redux';
import { CharacterView } from "models/status";
import { State, Dispatch } from "redux/store";
import ViewDispatcher from "redux/dispatchers/view";
import { Toggle, ToggleProps } from "components/atoms/input";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface VisibilityToggleProps extends Omit<ToggleProps, 'checked' | 'onChange'> {
	uuid: string;
}

function mapStateToProps(state: State, { uuid }: VisibilityToggleProps) {
	return { view: state.status.view.views.get(uuid) };
}

function mapDispatchToProps(dispatch: Dispatch) {
	return { dispatcher: new ViewDispatcher(dispatch) };
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
function mergeProps({ view }: StateProps, { dispatcher }: DispatchProps, props: VisibilityToggleProps): ToggleProps {
	const { uuid, ...rest } = props;
	const checked = Boolean(view && view.visible);
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked: visible } = event.currentTarget;
		if (view) dispatcher.update(new CharacterView({ ...view.toJSON(), visible }));
	};

	return { ...rest, checked, onChange };
}

export const VisibilityToggle = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toggle);