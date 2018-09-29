import { library } from '@fortawesome/fontawesome-svg-core';
import { faDice, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function build() {
	library.add(
		faDice,
		faUsers,
	);
};