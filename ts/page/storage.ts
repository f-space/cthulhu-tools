import { Character } from "model/character";
import { status } from "./application";

export default function (): void {
	loadCharacters();
	watchCharacters();
}

function loadCharacters(): void {
	const data = localStorage.getItem("characters");
	const characters = data ? JSON.parse(data) : [];
	for (const character of characters) {
		status.characters.add(new Character(character));
	}
}

function saveCharacters(): void {
	const characters = status.characters.list();
	const data = JSON.stringify(characters);
	localStorage.setItem("characters", data);
}

function watchCharacters(): void {
	status.characters.addListener(new class {
		onCharacterListChanged(): void {
			saveCharacters();
		}
	});
}