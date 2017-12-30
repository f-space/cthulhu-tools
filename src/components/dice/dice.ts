import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { DiceSet } from "models/dice";
import AppPage from "@component/page";
import DiceView from "@component/dice-view";
import CustomDiceDialog from "@component/dice/custom-dice-dialog";

type CustomDice = { count: number, max: number };

@Component({
	components: {
		AppPage,
		DiceView,
	}
})
export default class DicePage extends AppPage {
	public type: string | null = null;
	public custom: CustomDice = { count: 1, max: 100 };
	public values: number[] = [];

	public presets: string[] = ['1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'];

	public get CUSTOM_TYPE(): string { return 'custom'; }

	public get diceSet(): DiceSet {
		if (this.type !== null) {
			if (this.type !== this.CUSTOM_TYPE) {
				return DiceSet.parse(this.type);
			} else {
				return DiceSet.create(this.custom.count, this.custom.max);
			}
		}
		return new DiceSet([]);
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
		this.values = this.diceSet.dices.map(x => x.default);
		this.view.stop();
	}

	public roll(): void {
		this.values = this.diceSet.dices.map(x => x.roll(Math.random()));
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