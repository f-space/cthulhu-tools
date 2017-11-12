import Vue from 'vue';
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("page");

export default Vue.extend({
	name: "character-management-component",
	methods: {
		...mapMutations(["toCharacterEdit"]),
	}
});