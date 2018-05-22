import { Reference, CharacterParams, Character, Profile, Attribute, Skill, History, CharacterContext } from "models/data";
import { Cache, EvaluationChain, buildResolver, buildEvaluator, buildValidator } from "models/eval";
import { getSHA256 } from "models/utility";

export * from "models/data";
export * from "models/eval";

export class Status {
	private readonly chain: EvaluationChain;

	public constructor(readonly context: CharacterContext, cache?: Cache) {
		const resolver = buildResolver({ attributes: context.profile.attributes, skills: context.profile.skills });
		const evaluator = buildEvaluator({ params: context.character.params, history: context.history });
		const validator = buildValidator({ attribute: true, skill: true });
		this.chain = new EvaluationChain({ resolver, evaluator, validator, cache });
	}

	public get current(): string | null { return this.context.history && this.context.history.head; }
	public get hash(): string { return Status.basicsHash(this); }

	public get(id: string, hash?: string | null): any {
		return this.getByRef(new Reference(id), hash);
	}

	public getByRef(ref: Reference, hash: string | null = this.current): any {
		return this.chain.evaluate(ref, hash);
	}

	public static basics(status: Status): any {
		const { context: { profile: { attributes, skills } }, chain } = status;
		return [...attributes.filter(x => !x.view), ...skills]
			.reduce((values, { id }) => (values[id] = chain.evaluate(new Reference(id), null), values), Object.create(null));
	}

	public static basicsHash(status: Status): any {
		const values = this.basics(status);
		const json = JSON.stringify(values, Object.keys(values).sort());
		return getSHA256(json);
	}
}