import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import {
	Character, Profile, Attribute, Skill, Item, Property, DataProvider,
	AttributeParams, SkillParams,
	PropertyResolver, PropertyEvaluator, EvaluationContext, ProfileEvaluationContext, ResolverBuilder, EvaluatorBuilder
} from "models/status";
import { deepClone } from "models/utility";
import Page from "vue-models/page";
import AttributeInput from "@component/molecules/attribute-input";
import SkillInput from "@component/molecules/skill-input";
import PageTemplate from "@component/templates/page";

interface SkillSlot {
	id: string;
	point: number;
}

interface ItemSlot {
	uuid: string;
}

const StatusGetter = namespace("status", Getter);
const ViewAction = namespace("status/view", Action);
const CharacterAction = namespace("status/character", Action);

const OCCUPATION_SKILL_POINTS = "occupation_skill_points";
const HOBBY_SKILL_POINTS = "hobby_skill_points";

@Component({
	components: {
		AttributeInput,
		SkillInput,
		PageTemplate,
	}
})
export default class CharacterEditPage extends Page {
	public profileUUID: string | null = null;
	public attributeParams: AttributeParams = Object.create(null);
	public skillSlots: SkillSlot[] = [];
	public itemSlots: ItemSlot[] = [];

	@Prop()
	public readonly uuid!: string;

	@StatusGetter("provider")
	public readonly provider!: DataProvider;

	@CharacterAction("create")
	public readonly createCharacter!: (args: [Character]) => Promise<void>;

	@CharacterAction("update")
	public readonly updateCharacter!: (args: [Character]) => Promise<void>;

	public get profile(): Profile | undefined {
		return this.profileUUID !== null ? this.provider.profile.get(this.profileUUID) : this.provider.profile.default;
	}

	public get context(): ProfileEvaluationContext { return new EvaluationContext({ profile: this.profile }, this.provider); }

	public get evaluator(): PropertyEvaluator {
		return EvaluatorBuilder.build(Object.assign({
			params: {
				attribute: this.attributeParams,
				skill: this.skillParams,
			},
		}, this.context));
	}

	public get resolver(): PropertyResolver {
		return ResolverBuilder.build(this.context);
	}

	public get properties(): Property[] { return this.resolver.list(); }

	public get attributes(): Attribute[] { return this.properties.filter(x => x.type === 'attribute').map(x => x.entity as Attribute); }

	public get skills(): Skill[] { return this.properties.filter(x => x.type === 'skill').map(x => x.entity as Skill); }

	public get items(): Item[] { return this.provider.item.list(); }

	public get skillParams(): SkillParams {
		return this.skillSlots.reduce((data, { id, point }) => {
			if (id) data[id] = point;
			return data;
		}, Object.create(null));
	}

	public get availableSkillPoints(): number {
		const evaluator = this.evaluator;
		const osp = evaluator.evaluate(OCCUPATION_SKILL_POINTS, null) || 0;
		const hsp = evaluator.evaluate(HOBBY_SKILL_POINTS, null) || 0;
		return (osp + hsp);
	}

	public get consumedSkillPoints(): number {
		return this.skillSlots.reduce((sum, { point }) => sum + point, 0);
	}

	public get valid(): boolean { return (this.validateAttributeData() && this.validateSkillData()); }

	public updateAttributeParams(id: string, value: any): void {
		this.attributeParams = Object.assign({}, this.attributeParams, { [id]: value });
	}

	public newSkillSlot(): void {
		this.skillSlots.push({ id: "", point: 0 });
	}

	public deleteSkillSlot(): void {
		this.skillSlots.pop();
	}

	public newItemSlot(): void {
		this.itemSlots.push({ uuid: "" });
	}

	public deleteItemSlot(): void {
		this.itemSlots.pop();
	}

	public ok(): void { this.saveCharacter().then(() => { this.$router.back(); }); }

	public cancel(): void { this.$router.back(); }

	protected created(): void {
		const character = this.uuid !== undefined && this.provider.character.get(this.uuid);
		if (character) {
			this.profileUUID = character.profile;
			this.attributeParams = deepClone(character.params.attribute);
			this.skillSlots = Object.entries(character.params.skill).map(([id, point]) => ({ id, point }));
		}
	}

	private validateAttributeData(): boolean {
		return this.attributes.every(attribute => {
			if (attribute.inputs.length > 0) {
				const inputs = attribute.inputs;
				const data = this.attributeParams[attribute.id];
				return (data !== undefined && inputs.every(input => input.validate(data[input.name])));
			}
			return true;
		});
	}

	private validateSkillData(): boolean {
		return (this.consumedSkillPoints <= this.availableSkillPoints);
	}

	private async saveCharacter(): Promise<void> {
		const profile = this.profile;
		if (profile) {
			const character = new Character({
				uuid: this.uuid,
				profile: profile.uuid,
				params: {
					attribute: this.attributeParams,
					skill: this.skillParams,
					item: Object.create(null),
				}
			});

			if (this.uuid === undefined) {
				await this.createCharacter([character]);
			} else {
				await this.updateCharacter([character]);
			}
		}
	}
}