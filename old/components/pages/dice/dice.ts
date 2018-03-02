import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Dice } from "models/dice";
import Page from "vue-models/page";
import DiceView from "@component/organisms/dice-view";
import CustomDiceDialog from "@component/pages/custom-dice-dialog";
import PageTemplate from "@component/templates/page";

type CustomDice = { count: number, max: number };

@Component({
	components: {
		DiceView,
		PageTemplate,
	}
})
export default class DicePage extends Page {
	public type: string | null = null;
	public custom: CustomDice = { count: 1, max: 100 };
	public faces: number[] = [];

	public presets: string[] = ['1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'];

	public get CUSTOM_TYPE(): string { return 'custom'; }

	public get dices(): ReadonlyArray<Dice> {
		if (this.type !== null) {
			if (this.type !== this.CUSTOM_TYPE) {
				return Dice.parse(this.type);
			} else {
				return Dice.create(this.custom.count, this.custom.max);
			}
		}
		return [];
	}

	public get view(): DiceView { return this.$refs.view as DiceView; }

	@Watch("type")
	protected onTypeChanged(): void { this.reset(); }

	@Watch("custom", { deep: true })
	protected onCustomChanged({ count, max }: CustomDice): void {
		if (this.type === this.CUSTOM_TYPE) {
			this.reset();
		}
	}

	public reset(): void {
		this.faces = this.dices.map(dice => dice.default);
		this.view.stop();
	}

	public roll(): void {
		this.view.roll();
	}

	public openCustomDiceDialog(): void {
		this.openDialog(CustomDiceDialog, {
			initCount: this.custom.count,
			initMax: this.custom.max,
		}).then(result => {
			if (result.status) {
				this.type = this.CUSTOM_TYPE;
				this.custom.count = result.value.count;
				this.custom.max = result.value.max;
			}
		});
	}
}