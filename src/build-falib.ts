import { library } from '@fortawesome/fontawesome-svg-core';
import * as icons from '@fortawesome/free-solid-svg-icons';

export default function build() {
	library.add(
		icons.faChevronCircleLeft,
		icons.faChevronCircleRight,
		icons.faDice,
		icons.faEdit,
		icons.faList,
		icons.faPlus,
		icons.faTrashAlt,
		icons.faUsers,
	);
};