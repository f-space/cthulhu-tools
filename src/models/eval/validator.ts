import { Reference, Attribute, IntegerAttribute, NumberAttribute, TextAttribute, Skill } from "models/data";
import { Property, AttributeProperty, SkillProperty } from "./property";

export interface ValidationContext {
	readonly ref: Reference;
	readonly hash: string | null;
	readonly property: Property;
	readonly value: any;
	request(ref: Reference, hash: string | null): any;
}

export interface PropertyValidator {
	validate(context: ValidationContext): any;
}

export interface TerminalValidator extends PropertyValidator {
	supports(context: ValidationContext): boolean;
}

export class AttributeValidator implements TerminalValidator {
	public supports(context: ValidationContext): boolean {
		return ('attribute' in context.property);
	}

	public validate(context: ValidationContext): any {
		const { property, value } = context;
		if (this.supports(context) && value !== undefined) {
			const { attribute } = property as AttributeProperty;
			switch (attribute.type) {
				case 'integer': return this.validateInteger(context);
				case 'number': return this.validateNumber(context);
				case 'text': return this.validateText(context);
			}
		}
		return undefined;
	}

	private validateInteger(context: ValidationContext): number | undefined {
		const { ref, hash, property, value, request } = context;
		switch (property.type) {
			case 'attribute':
				const min = request(ref.set({ modifier: 'min' }), hash);
				const max = request(ref.set({ modifier: 'max' }), hash);
				return (min !== undefined && max !== undefined) ? Math.round(Math.max(Math.min(value, max), min)) : undefined;
			case 'attribute:min': return Math.round(value);
			case 'attribute:max': return Math.round(value);
			default: return undefined;
		}
	}

	private validateNumber(context: ValidationContext): number | undefined {
		const { ref, hash, property, value, request } = context;
		switch (property.type) {
			case 'attribute':
				const min = request(ref.set({ modifier: 'min' }), hash);
				const max = request(ref.set({ modifier: 'max' }), hash);
				return (min !== undefined && max !== undefined) ? Number(Math.max(Math.min(value, max), min)) : undefined;
			case 'attribute:min': return Number(value);
			case 'attribute:max': return Number(value);
			default: return undefined;
		}
	}

	private validateText(context: ValidationContext): string | undefined {
		const { property, value } = context;
		switch (property.type) {
			case 'attribute': return String(value);
			default: return undefined;
		}
	}
}

export class SkillValidator implements TerminalValidator {
	public readonly min: number;
	public readonly max: number;

	public constructor(min: number = 0, max: number = 99) {
		this.min = Number.isSafeInteger(min) ? Math.ceil(min) : Number.MIN_SAFE_INTEGER;
		this.max = Number.isSafeInteger(max) ? Math.floor(max) : Number.MAX_SAFE_INTEGER;
	}

	public supports(context: ValidationContext): boolean {
		return ('skill' in context.property);
	}

	public validate(context: ValidationContext): any {
		const { property, value } = context;
		if (this.supports(context) && value !== undefined) {
			switch (property.type) {
				case 'skill':
				case 'skill:base':
				case 'skill:points':
					return Math.round(Math.max(Math.min(value, this.max), this.min));
			}
		}
		return undefined;
	}
}

export class CompositeValidator implements PropertyValidator {
	public constructor(readonly validators: ReadonlyArray<TerminalValidator>) { }

	public validate(context: ValidationContext): any {
		const validator = this.validators.find(validator => validator.supports(context));

		return validator && validator.validate(context);
	}
}

export class VoidValidator implements PropertyValidator {
	public validate(context: ValidationContext): any { return context.value; }
}

export interface ValidatorConfig {
	readonly attribute?: boolean;
	readonly skill?: boolean | { min?: number, max?: number };
}

export function buildValidator(config: ValidatorConfig): PropertyValidator {
	const validators = [] as TerminalValidator[];

	if (config.attribute) validators.push(new AttributeValidator());
	if (config.skill) {
		const skill = (typeof config.skill === 'object') ? config.skill : {};
		validators.push(new SkillValidator(skill.min, skill.max));
	}

	switch (validators.length) {
		case 0: return new VoidValidator();
		case 1: return validators[0];
		default: return new CompositeValidator(validators);
	}
}