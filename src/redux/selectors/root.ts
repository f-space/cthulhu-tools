import { createSelector } from 'reselect';
import { DataProvider } from "models/status";
import { State } from "redux/reducers/root";
import { getCharacterProvider } from "./character";
import { getProfileProvider } from "./profile";
import { getAttributeProvider } from "./attribute";
import { getSkillProvider } from "./skill";
import { getItemProvider } from "./item";
import { getHistoryProvider } from "./history";

export const getDataProvider = createSelector(
	(state: State) => getCharacterProvider(state.character),
	(state: State) => getProfileProvider(state.profile),
	(state: State) => getAttributeProvider(state.attribute),
	(state: State) => getSkillProvider(state.skill),
	(state: State) => getItemProvider(state.item),
	(state: State) => getHistoryProvider(state.history),
	(character, profile, attribute, skill, item, history) => ({ character, profile, attribute, skill, item, history } as DataProvider)
);