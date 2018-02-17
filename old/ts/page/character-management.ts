import { Character, CharacterListOperation } from "model/character";
import { StatusData, StatusManager, StatusResolver } from "model/status";
import { showLoadFileDialog, showSaveFileDialog, readAsText } from "view/file";
import { Page } from "view/page";
import { status, navigation } from "./application";

let page: HTMLElement;
const checked = new Set<string>();

export default function (): void {
	page = document.getElementById("character-management") as HTMLElement;

	initNavigationEvent();
	initCharacterUpdateEvent();
	initCommands();
}

function initNavigationEvent(): void {
	navigation.addListener(new class {
		onEnter(page: Page): void {
			if (page === 'character-management') {
				initCharacters();
			}
		}

		onExit(page: Page): void {
			if (page === 'character-management') {
				clearCharacters();
				clearChecks();
			}
		}
	});
}

function initCharacterUpdateEvent(): void {
	status.characters.addListener(new class {
		onCharacterListChanged(operation: CharacterListOperation, target: Character): void {
			if (operation === 'remove') {
				checkCharacter(target.uuid, false);
			}

			if (navigation.page === 'character-management') {
				clearCharacters();
				initCharacters();
				refreshCheckState();
			}
		}
	});
}

function checkCharacter(uuid: string, value: boolean): void {
	if (value) {
		checked.add(uuid);
	} else {
		checked.delete(uuid);
	}

	refreshCheckState();
}

function clearChecks(): void {
	checked.clear();
	refreshCheckState();
}

function refreshCheckState(): void {
	const characterElements = Array.from(page.querySelectorAll(".characters .character")) as HTMLElement[];
	for (const characterElement of characterElements) {
		const checkElement = characterElement.querySelector(".check input") as HTMLInputElement;
		const uuid = characterElement.dataset['uuid'];
		checkElement.checked = uuid !== undefined && checked.has(uuid);
	}

	updateSelectionState()
}

function updateSelectionState(): void {
	const charactersElement = page.querySelector(".characters") as HTMLElement;

	charactersElement.classList.remove("selected", "single");
	if (checked.size !== 0) charactersElement.classList.add("selected");
	if (checked.size === 1) charactersElement.classList.add("single");
}

function initCharacters(): void {
	const charactersElement = page.querySelector(".characters") as HTMLElement;
	const characterTemplate = charactersElement.querySelector(".character-template") as HTMLTemplateElement;

	for (const character of status.characters) {
		const resolver = new StatusResolver(status, character);

		const node = document.importNode(characterTemplate.content, true);
		const characterElement = node.querySelector(".character") as HTMLElement;
		const checkElement = characterElement.querySelector(".check input") as HTMLInputElement;
		const nameElement = characterElement.querySelector(".name") as HTMLElement;
		const visibilityElement = characterElement.querySelector(".visibility") as HTMLButtonElement;

		characterElement.dataset['uuid'] = character.uuid;

		checkElement.addEventListener('change', () => { checkCharacter(character.uuid, checkElement.checked); });

		nameElement.textContent = resolver.resolve('name');

		if (!character.visible) visibilityElement.classList.add('hidden');
		visibilityElement.addEventListener('click', () => {
			character.visible = !character.visible;
			status.characters.refresh(character);
		});

		charactersElement.appendChild(characterElement);
	}
}

function clearCharacters(): void {
	page.querySelectorAll(".characters .character").forEach(x => x.remove());
}

function initCommands(): void {
	const commandsElement = page.querySelector(".commands") as HTMLElement;

	initDeleteCommand(commandsElement);
	initCloneCommand(commandsElement);
	initEditCommand(commandsElement);
	initImportCommand(commandsElement);
	initExportCommand(commandsElement);
}

function initDeleteCommand(commands: HTMLElement): void {
	const deleteElement = commands.querySelector(".delete") as HTMLButtonElement;
	deleteElement.addEventListener('click', () => {
		for (const character of collectCheckedCharacters()) {
			status.characters.remove(character);
		}
		clearChecks();
	});
}

function initCloneCommand(commands: HTMLElement): void {
	const cloneElement = commands.querySelector(".clone") as HTMLButtonElement;
	cloneElement.addEventListener('click', () => {
		for (const character of collectCheckedCharacters()) {
			status.characters.add(new Character(Object.assign(character.toJSON(), { uuid: undefined })))
		}
		clearChecks();
	});
}

function initEditCommand(commands: HTMLElement): void {
	const editElement = commands.querySelector(".edit") as HTMLButtonElement;
	editElement.addEventListener('click', () => {
		const character = getCheckedCharacter();
		if (character) {
			navigation.toPage('character-edit', character);
			clearChecks();
		}
	});
}

function initImportCommand(commands: HTMLElement): void {
	const importElement = commands.querySelector(".import") as HTMLButtonElement;
	importElement.addEventListener('click', () => {
		showLoadFileDialog(".json").then(file => readAsText(file, 'utf8')).then(data => {
			status.import(JSON.parse(data));
		});
	});
}

function initExportCommand(commands: HTMLElement): void {
	const exportElement = commands.querySelector(".export") as HTMLButtonElement;
	exportElement.addEventListener('click', () => {
		const characters = collectCheckedCharacters();
		const data = JSON.stringify(StatusData.create({ characters: characters }, status), null, 4);

		showSaveFileDialog("characters.json", "application/json", data);
	});
}

function collectCheckedCharacters(): Character[] {
	const elements = Array.from(page.querySelectorAll(".characters .character")) as HTMLElement[];
	const checked = elements.filter(element => element.querySelector(".check :checked") !== null);
	const uuids = checked.map(element => element.dataset.uuid || "");
	const characters = uuids.map(uuid => status.characters.get(uuid) as Character);
	return characters.filter(x => x !== undefined);
}

function getCheckedCharacter(): Character | undefined {
	const characters = collectCheckedCharacters();

	return (characters.length === 1 ? characters[0] : undefined);
}