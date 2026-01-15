module.exports = () => {
	return {
		plugins: [
			require('autoprefixer')({ remove: false }),
			require('cssnano')({ preset: 'default' }),
		]
	};
};