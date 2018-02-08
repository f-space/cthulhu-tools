import Vue, { CreateElement, RenderContext } from 'vue';
import FlowLayout from "@component/molecules/dice-flow-layout";
import CircleLayout from "@component/molecules/dice-circle-layout";
import RowLayout from "@component/molecules/dice-row-layout";

type LayoutType = 'flow' | 'circle' | 'row';

export default Vue.extend({
	functional: true,
	props: {
		layout: {
			type: String,
			required: true,
		},
		display: {
			type: Array,
			required: true,
		}
	},
	render: function (createElement: CreateElement, context: RenderContext) {
		const component = selectLayout(context.props.layout as LayoutType);
		const data = Object.assign({}, context.data, { props: { display: context.props.display } });
		const children = context.children;

		return createElement(component, data, children);

		function selectLayout(layout: LayoutType) {
			switch (layout) {
				case 'flow': return FlowLayout;
				case 'circle': return CircleLayout;
				case 'row': return RowLayout;
			}
		}
	}
});