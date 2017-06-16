import { DiceSet } from "model/dice";
import { Profile } from "model/profile";
import { Attribute } from "model/attribute";
import { InputMethod, DiceInputMethod, NumberInputMethod, TextInputMethod } from "model/input";
import { Skill } from "model/skill";
import { Item } from "model/item";
import { Character } from "model/character";
import { StatusResolver } from "model/status";
import { DiceRollEventType, DiceManager } from "model/dice-roll";
import DiceImage from "view/dice-image";
import DiceRenderer from "view/dice-renderer";
import { Page } from "view/page";
import { status, navigation, resources } from "./application";

let page: HTMLElement;
let character: Character;

type InputTemplates = {[T in InputMethod['type']]: HTMLTemplateElement};
interface InputContext<T extends InputMethod> {
	readonly character: Character;
	readonly attribute: Attribute;
	readonly input: T;
	update(): void;
}

export default function (): void {
	page = document.getElementById('character-edit') as HTMLElement;

	initNavigationEvent();
	initActions();
}

function initNavigationEvent(): void {
	navigation.addListener(new class {
		onEnter(page: Page, context?: any): void {
			if (page === 'character-edit') {
				initCharacter(context instanceof Character ? context : undefined);
			}
		}

		onExit(page: Page): void {
			if (page === 'character-edit') {
				clearElements();
			}
		}
	});
}

function clearElements(): void {
	page.querySelectorAll(".attributes .attribute").forEach(x => x.remove());
	page.querySelectorAll(".skills .skill").forEach(x => x.remove());
	page.querySelectorAll(".items .item").forEach(x => x.remove());
}

function initCharacter(target?: Character): void {
	const supplier = target ? editCharacter(target) : newCharacter();
	supplier.then(result => {
		character = result;

		initAttributes();
		initSkills();
		initItems();
		refreshValues();
	})
}

async function newCharacter(): Promise<Character> {
	const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));
	let profile: Profile | undefined;
	while (!(profile = status.profiles.list().find(x => x.default))) {
		await sleep(1000);
	}

	return new Character((<Profile>profile).uuid);
}

async function editCharacter(target: Character): Promise<Character> {
	return new Character(target);
}

function initAttributes(): void {
	const attributesElement = page.querySelector(".attributes") as HTMLElement;
	const attributeTemplate = page.querySelector(".attribute-template") as HTMLTemplateElement;

	const profile = status.profiles.get(character.profile);
	if (profile) {
		const attributes = status.attributes.get(profile.attributes);
		for (const attribute of attributes) {
			if (!attribute.hidden) {
				const attributeElement = document.importNode(attributeTemplate.content, true);
				const nameElement = attributeElement.querySelector(".name") as HTMLElement;
				const valueElement = attributeElement.querySelector(".value") as HTMLElement;
				const inputElement = attributeElement.querySelector(".input") as HTMLElement;

				nameElement.textContent = attribute.name;
				valueElement.dataset.attribute = attribute.id;
				inputElement.addEventListener('click', () => { openInputDialog(attribute); });
				if (attribute.inputs.length === 0) inputElement.classList.add("no-input");

				attributesElement.appendChild(attributeElement);
			}
		}
	}
}

function initSkills(): void {
	const skillsElement = page.querySelector(".skills") as HTMLElement;
	const skillTemplate = page.querySelector(".skill-template") as HTMLTemplateElement;

	const profile = status.profiles.get(character.profile);
	if (profile) {
		const skills = character.points.skills();
		const count = Math.max(profile.skillSlots.initial, skills.length);
		for (let i = 0; i < count; i++) {
			const skillElement = document.importNode(skillTemplate.content, true);
			const idElement = skillElement.querySelector(".id") as HTMLSelectElement;
			const pointsElement = skillElement.querySelector(".points") as HTMLInputElement;

			for (const skill of status.skills) {
				idElement.options.add(new Option(skill.name, skill.id));
			}

			if (i < skills.length) {
				idElement.value = skills[i];
				pointsElement.value = character.points.get(skills[i]).toString(10);
			}

			idElement.addEventListener('input', () => {
				refreshSkillPoints();
				refreshValues();
			});
			pointsElement.addEventListener('input', () => {
				refreshSkillPoints();
				refreshValues();
			})

			skillsElement.appendChild(skillElement);
		}
	}
}

function initItems(): void {
	const itemsElement = page.querySelector(".items") as HTMLElement;
	const itemTemplate = page.querySelector(".item-template") as HTMLTemplateElement;

	const profile = status.profiles.get(character.profile);
	if (profile) {
		const count = Math.max(profile.itemSlots.initial, character.items.length);
		for (let i = 0; i < count; i++) {
			const itemElement = document.importNode(itemTemplate.content, true);
			const nameElement = itemElement.querySelector(".name") as HTMLInputElement;
			const descriptionElement = itemElement.querySelector(".description") as HTMLInputElement;

			if (i < character.items.length) {
				const item = character.items[i];
				nameElement.value = item.name;
				descriptionElement.value = item.description;
			}

			nameElement.addEventListener('input', refreshItems);
			descriptionElement.addEventListener('input', refreshItems);

			itemsElement.appendChild(itemElement);
		}
	}
}

function initActions(): void {
	const actionsElement = page.querySelector(".actions") as HTMLElement;
	const okButton = actionsElement.querySelector(".ok") as HTMLButtonElement;
	const cancelButton = actionsElement.querySelector(".cancel") as HTMLButtonElement;

	okButton.addEventListener('click', () => {
		status.characters.add(character);

		navigation.toPage('character-management');
	});
	cancelButton.addEventListener('click', () => {
		navigation.toPage('character-management');
	});
}

function refreshSkillPoints(): void {
	const skillElements = Array.from(page.querySelectorAll(".skills .skill")) as HTMLElement[];

	character.points.clear();
	for (const skillElement of skillElements) {
		const idElement = skillElement.querySelector(".id") as HTMLSelectElement;
		const pointsElement = skillElement.querySelector(".points") as HTMLInputElement;
		if (idElement.validity.valid && pointsElement.validity.valid && pointsElement.value !== "") {
			const id = idElement.value;
			const points = parseInt(pointsElement.value, 10);
			character.points.set(id, points);
		}
	}
}

function refreshItems(): void {
	const itemElements = Array.from(page.querySelectorAll(".items .item")) as HTMLElement[];

	character.items.splice(0);
	for (const itemElement of itemElements) {
		const nameElement = itemElement.querySelector(".name") as HTMLInputElement;
		const descriptionElement = itemElement.querySelector(".description") as HTMLInputElement;
		if (nameElement.validity.valid && descriptionElement.validity.valid && nameElement.value !== "") {
			const name = nameElement.value;
			const description = descriptionElement.value;
			character.items.push(new Item(name, description));
		}
	}
}

function refreshValues(): void {
	const attributeElements = Array.from(page.querySelectorAll(".attributes .attribute")) as HTMLElement[];
	const skillElements = Array.from(page.querySelectorAll(".skills .skill")) as HTMLElement[];

	const characterBase = new Character(character);
	characterBase.points.clear();

	const resolver = new StatusResolver(status, character);
	const resolverBase = new StatusResolver(status, characterBase);

	for (const attributeElement of attributeElements) {
		const valueElement = attributeElement.querySelector(".value") as HTMLElement;
		const id = valueElement.dataset.attribute;
		if (id !== undefined) {
			valueElement.textContent = resolver.resolve(id, null);
		}
	}

	for (const skillElement of skillElements) {
		const idElement = skillElement.querySelector(".id") as HTMLSelectElement;
		const baseElement = skillElement.querySelector(".base") as HTMLElement;
		const valueElement = skillElement.querySelector(".value") as HTMLElement;
		if (idElement.validity.valid) {
			const id = idElement.value;
			baseElement.textContent = resolverBase.resolve(id, null);
			valueElement.textContent = resolver.resolve(id, null);
		}
	}
}

function getInputDialog(): HTMLElement {
	return document.getElementById("character-input-dialog") as HTMLElement;
}

function openInputDialog(attribute: Attribute): void {
	const dialog = getInputDialog();
	if (!dialog.classList.contains("open")) {
		const contentsTemplate = dialog.querySelector(".contents-template") as HTMLTemplateElement;
		const contents = document.importNode(contentsTemplate.content, true);
		const cancelButton = contents.querySelector(".cancel") as HTMLButtonElement;
		const okButton = contents.querySelector(".ok") as HTMLButtonElement;

		const target = new Character(character);
		setAttribute(contents, target, attribute);

		cancelButton.addEventListener('click', () => closeInputDialog());
		okButton.addEventListener('click', () => {
			character = target;
			refreshValues();
			closeInputDialog();
		})

		dialog.appendChild(contents);

		dialog.classList.add("open");
	}
}

function closeInputDialog(): void {
	const dialog = getInputDialog();
	if (dialog.classList.contains("open")) {
		const contents = dialog.querySelector(".contents") as HTMLElement;
		dialog.removeChild(contents);

		dialog.classList.remove("open");
	}
}

function getInputTemplates(): InputTemplates {
	const dialog = getInputDialog();
	return {
		dice: dialog.querySelector(".dice-input-template") as HTMLTemplateElement,
		number: dialog.querySelector(".number-input-template") as HTMLTemplateElement,
		text: dialog.querySelector(".text-input-template") as HTMLTemplateElement,
	};
}

function setAttribute(contents: DocumentFragment, character: Character, attribute: Attribute): void {
	const nameElement = contents.querySelector(".name") as HTMLElement;
	const expressionElement = contents.querySelector(".expression") as HTMLElement;
	const inputsElement = contents.querySelector(".inputs") as HTMLElement;
	const valueElement = contents.querySelector(".value") as HTMLElement;
	const templates = getInputTemplates();

	nameElement.textContent = attribute.name;
	expressionElement.textContent = attribute.expression;

	const resolver = new StatusResolver(status, character, false);
	const context = {
		character: character,
		attribute: attribute,
		update() { valueElement.textContent = resolver.resolve(this.attribute.id, null); },
	};
	for (const input of attribute.inputs) {
		inputsElement.appendChild(newInput(templates, Object.assign({ input: input }, context)));
	}

	context.update();
}

function newInput(templates: InputTemplates, context: InputContext<any>): HTMLElement {
	switch (context.input.type) {
		case 'dice': return newDiceInput(templates.dice, context);
		case 'number': return newNumberInput(templates.number, context);
		case 'text': return newTextInput(templates.text, context);
		default: throw new Error('Invalid input type.');
	}
}

function newDiceInput(template: HTMLTemplateElement, context: InputContext<DiceInputMethod>): HTMLElement {
	const node = document.importNode(template.content, true);
	const inputElement = node.querySelector(".input") as HTMLElement;
	const nameElement = inputElement.querySelector(".input-name") as HTMLElement;
	const diceViewElement = inputElement.querySelector(".dice-view") as HTMLElement;
	const rollButtonElement = inputElement.querySelector(".roll-button") as HTMLElement;

	nameElement.textContent = context.input.name;

	const diceSet = DiceSet.create(context.input.count, context.input.max);
	const value = context.character.inputs.getInput(context.attribute.id, context.input);
	if (value !== undefined) diceSet.values = value;

	const manager = new DiceManager();
	manager.register("input", diceSet);
	manager.select("input");
	manager.addListener(new DiceRenderer(diceViewElement, resources.diceImage, 'dice-group', 'dice'));
	manager.addListener(new class {
		onAttached(manager: DiceManager): void { this.update(manager.diceSet as DiceSet); }
		onRoll(manager: DiceManager, type: DiceRollEventType): void { if (type === DiceRollEventType.Stop) this.update(manager.diceSet as DiceSet); }
		update(diceSet: DiceSet): void {
			context.character.inputs.setInput(context.attribute.id, context.input, diceSet.values);
			context.update();
		}
	});

	rollButtonElement.addEventListener('click', () => { manager.roll(); });

	return inputElement;
}

function newNumberInput(template: HTMLTemplateElement, context: InputContext<NumberInputMethod>): HTMLElement {
	const node = document.importNode(template.content, true);
	const inputElement = node.querySelector(".input") as HTMLElement;
	const nameElement = inputElement.querySelector(".input-name") as HTMLElement;
	const numberInputElement = inputElement.querySelector("input") as HTMLInputElement;

	nameElement.textContent = context.input.name;
	if (Number.isFinite(context.input.min)) numberInputElement.min = context.input.min.toString(10);
	if (Number.isFinite(context.input.max)) numberInputElement.max = context.input.max.toString(10);
	if (Number.isFinite(context.input.step)) numberInputElement.step = context.input.step.toString(10);
	numberInputElement.value = (context.character.inputs.getInput(context.attribute.id, context.input) || 0).toString(10);
	numberInputElement.addEventListener('input', () => {
		if (numberInputElement.validity.valid) {
			context.character.inputs.setInput(context.attribute.id, context.input, parseFloat(numberInputElement.value));
			context.update();
		}
	});

	return inputElement;
}

function newTextInput(template: HTMLTemplateElement, context: InputContext<TextInputMethod>): HTMLElement {
	const node = document.importNode(template.content, true);
	const inputElement = node.querySelector(".input") as HTMLElement;
	const nameElement = inputElement.querySelector(".input-name") as HTMLElement;
	const textInputElement = inputElement.querySelector("input") as HTMLInputElement;

	nameElement.textContent = context.input.name;
	textInputElement.value = context.character.inputs.getInput(context.attribute.id, context.input) || "";
	textInputElement.addEventListener('input', () => {
		if (textInputElement.validity.valid) {
			context.character.inputs.setInput(context.attribute.id, context.input, textInputElement.value);
			context.update();
		}
	});

	return inputElement;
}

