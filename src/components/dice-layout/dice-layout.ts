import Vue from 'vue';

export default Vue.extend({
	name: "dice-layout",
	props: {
		width: {
			type: Number,
			required: true,
			validator(value: number) { return Number.isFinite(value) && value >= 0; },
		},
		height: {
			type: Number,
			required: true,
			validator(value: number) { return Number.isFinite(value) && value >= 0; },
		},
		groupCount: {
			type: Number,
			required: true,
		},
		groupLength: {
			type: Number,
			required: true,
		},
		dices: {
			type: Array as { (): { type: string, face: number }[][] },
			required: true,
		},
	},
});