import { ViewAction } from "redux/actions/view";
import { CharacterAction } from "redux/actions/character";
import { ProfileAction } from "redux/actions/profile";
import { AttributeAction } from "redux/actions/attribute";
import { SkillAction } from "redux/actions/skill";
import { ItemAction } from "redux/actions/item";
import { HistoryAction } from "redux/actions/history";

export type Action =
	| ViewAction
	| CharacterAction
	| ProfileAction
	| AttributeAction
	| SkillAction
	| ItemAction
	| HistoryAction