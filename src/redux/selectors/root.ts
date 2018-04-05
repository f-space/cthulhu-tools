import { createStructuredSelector } from 'reselect';
import { DataProvider } from "models/status";
import { State } from "redux/store";
import { getCharacterProvider } from "redux/selectors/character";
import { getProfileProvider } from "redux/selectors/profile";
import { getAttributeProvider } from "redux/selectors/attribute";
import { getSkillProvider } from "redux/selectors/skill";
import { getItemProvider } from "redux/selectors/item";
import { getHistoryProvider } from "redux/selectors/history";

export const getDataProvider = createStructuredSelector<State, DataProvider>({
	character: getCharacterProvider,
	profile: getProfileProvider,
	attribute: getAttributeProvider,
	skill: getSkillProvider,
	item: getItemProvider,
	history: getHistoryProvider,
});