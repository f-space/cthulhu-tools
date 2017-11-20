import Vue from 'vue';
import PageDialog from "components/dialog/dialog.vue";

export default Vue.extend({
	name: "custom-dice-dialog",
	props: {
		initCount: {
			type: Number,
			default: 1,
		},
		initMax: {
			type: Number,
			default: 100,
		},
	},
	data() {
		return {
			count: this.initCount,
			max: this.initMax,
			valid: true,
		};
	},
	watch: {
		count() { this.valid = this.validate(); },
		max() { this.valid = this.validate(); }
	},
	methods: {
		validate(): boolean {
			const { count, max } = this.$refs as { [prop: string]: HTMLInputElement };
			return [count, max].every(x => x.validity.valid);
		},
		ok() { this.$emit('closed', { canceled: false, count: this.count, max: this.max }); },
		cancel() { this.$emit('closed', { canceled: true }); },
	},
	components: {
		PageDialog,
	}
});