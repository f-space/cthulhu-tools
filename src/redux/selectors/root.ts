import { createSelector } from 'reselect';
import { DataProvider } from "models/status";
import { State } from "redux/reducers/root";
import { getCharacterProvider } from "redux/selectors/character";
import { getProfileProvider } from "redux/selectors/profile";
import { getAttributeProvider } from "redux/selectors/attribute";
import { getSkillProvider } from "redux/selectors/skill";
import { getItemProvider } from "redux/selectors/item";
import { getHistoryProvider } from "redux/selectors/history";

export const getDataProvider = createSelector(
	(state: State) => getCharacterProvider(state.character),
	(state: State) => getProfileProvider(state.profile),
	(state: State) => getAttributeProvider(state.attribute),
	(state: State) => getSkillProvider(state.skill),
	(state: State) => getItemProvider(state.item),
	(state: State) => getHistoryProvider(state.history),
	(character, profile, attribute, skill, item, history) => ({ character, profile, attribute, skill, item, history } as DataProvider)
);