module.exports = {
	hookAfter(loader, callback) {
		return new Proxy(loader, {
			get(target, key) {
				if (key === 'async') return function () {
					const original = loader.async();
					return function () {
						callback.apply(loader, arguments)
						original.apply(this, arguments);
					}
				}
				return target[key];
			}
		})
	}
};