import { ViewAction } from "./view";
import { CharacterAction } from "./character";
import { ProfileAction } from "./profile";
import { AttributeAction } from "./attribute";
import { SkillAction } from "./skill";
import { ItemAction } from "./item";
import { HistoryAction } from "./history";

export type Action =
	| ViewAction
	| CharacterAction
	| ProfileAction
	| AttributeAction
	| SkillAction
	| ItemAction
	| HistoryAction