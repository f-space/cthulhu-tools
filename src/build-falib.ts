import { library } from '@fortawesome/fontawesome-svg-core';
import { faDice, faUsers, faList, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function build() {
	library.add(
		faDice,
		faUsers,
		faList,
		faPlus,
	);
};