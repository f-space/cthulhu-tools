import { library } from '@fortawesome/fontawesome-svg-core';
import * as icons from '@fortawesome/free-solid-svg-icons';

export default function build() {
	library.add(
		icons.faDice,
		icons.faUsers,
		icons.faList,
		icons.faPlus,
		icons.faChevronCircleLeft,
		icons.faChevronCircleRight,
		icons.faEdit,
	);
};