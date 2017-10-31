import { PropertyResolver } from "model/property";
import { StatusManager, StatusResolver } from "model/status";
import { Profile, ProfileManager } from "model/profile";
import { Attribute, AttributeManager } from "model/attribute";
import { Skill, SkillManager } from "model/skill";
import { Item } from "model/item";
import { Character, CharacterListOperation, CharacterManager } from "model/character";
import { SetNumberOperation, SetTextOperation, AddNumberOperation } from "model/operation";
import { status } from "./application";
import characterManagement from "./character-management";
import characterEdit from "./character-edit";

interface Templates {
	character: HTMLTemplateElement;
	integer: HTMLTemplateElement;
	number: HTMLTemplateElement;
	text: HTMLTemplateElement;
	skill: HTMLTemplateElement;
	item: HTMLTemplateElement;
}

let page: HTMLElement;

export default function () {
	page = document.getElementById('status') as HTMLElement;

	loadDefaultData().then(() => {
		initCharacters();
		characterManagement();
		characterEdit();
	});;
}

function initCharacters(): void {
	const characters = page.querySelector(".characters") as HTMLElement;
	const templates = <Templates>{
		character: characters.querySelector(".character-template"),
		integer: characters.querySelector(".integer-template"),
		number: characters.querySelector(".number-template"),
		text: characters.querySelector(".text-template"),
		skill: characters.querySelector(".skill-template"),
		item: characters.querySelector(".item-template"),
	};

	status.characters.addListener(new class {
		onCharacterListChanged(operation: CharacterListOperation, target: Character): void {
			refreshCharacters(characters, templates);
		}
	});

	refreshCharacters(characters, templates);
}

function refreshCharacters(characters: HTMLElement, templates: Templates): void {
	characters.querySelectorAll(".character").forEach(x => x.remove());

	for (const character of status.characters) {
		if (status.validateCharacter(character) && character.visible) {
			const resolver = new StatusResolver(status, character);
			const profile = status.profiles.get(character.profile) as Profile;
			const attributes = status.attributes.get(profile.attributes);
			const points = character.points;
			const items = character.items;

			const characterElement = document.importNode(templates.character.content, true);

			const attrContainer = characterElement.querySelector(".attributes") as HTMLElement;
			for (const attr of attributes) {
				switch (attr.type) {
					case 'integer': attrContainer.appendChild(newAttribute(attr, resolver, templates.integer)); break;
					case 'number': attrContainer.appendChild(newAttribute(attr, resolver, templates.number)); break;
					case 'text': attrContainer.appendChild(newAttribute(attr, resolver, templates.text)); break;
				}
			}

			const skillContainer = characterElement.querySelector(".skills") as HTMLElement;
			for (const [id, point] of points) {
				const skill = status.skills.get(id);
				if (skill) {
					skillContainer.appendChild(newSkill(skill, resolver, templates.skill));
				}
			}

			const itemContainer = characterElement.querySelector(".items") as HTMLElement;
			for (const item of items) {
				itemContainer.appendChild(newItem(item, resolver, templates.item));
			}

			characters.appendChild(characterElement);
		}
	}
}

function newAttribute(attribute: Attribute, resolver: PropertyResolver, template: HTMLTemplateElement): HTMLElement {
	const node = document.importNode(template.content, true);
	const element = node.querySelector(".attribute") as HTMLElement;
	const nameElement = node.querySelector(".attr-name") as HTMLElement;
	const valueElement = node.querySelector(".attr-value") as HTMLElement;

	element.dataset['attr'] = attribute.id;
	nameElement.textContent = attribute.name;
	valueElement.textContent = resolver.resolve(attribute.id);

	return element;
}

function newSkill(skill: Skill, resolver: PropertyResolver, template: HTMLTemplateElement): HTMLElement {
	const node = document.importNode(template.content, true);
	const element = node.querySelector(".skill") as HTMLElement;
	const nameElement = node.querySelector(".skill-name") as HTMLElement;
	const scoreElement = node.querySelector(".skill-score") as HTMLElement;

	element.dataset['skill'] = skill.id;
	nameElement.textContent = skill.name;
	scoreElement.textContent = resolver.resolve(skill.id);

	return element;
}

function newItem(item: Item, resolver: PropertyResolver, template: HTMLTemplateElement): HTMLElement {
	const node = document.importNode(template.content, true);
	const element = node.querySelector(".item") as HTMLElement;
	const nameElement = node.querySelector(".item-name") as HTMLElement;
	const descElement = node.querySelector(".item-desc") as HTMLElement;

	nameElement.textContent = item.name;
	descElement.textContent = item.description;

	return element;
}

function loadDefaultData(): Promise<void> {
	return <Promise<any>>Promise.all([
		status.profiles.load("./data/profiles.json", true),
		status.attributes.load("./data/attributes.json", true),
		status.skills.load("./data/skills.json", true),
	]);
}
