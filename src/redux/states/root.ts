import { ViewState } from "redux/states/view";
import { CharacterState } from "redux/states/character";
import { ProfileState } from "redux/states/profile";
import { AttributeState } from "redux/states/attribute";
import { SkillState } from "redux/states/skill";
import { ItemState } from "redux/states/item";
import { HistoryState } from "redux/states/history";

export interface State {
	view: ViewState;
	character: CharacterState;
	profile: ProfileState;
	attribute: AttributeState;
	skill: SkillState;
	item: ItemState;
	history: HistoryState;
}