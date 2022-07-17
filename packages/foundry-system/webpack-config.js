const { merge } = require('webpack-merge');
const getWebpackConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
	config = getWebpackConfig(config);
	return merge(config, {
		module: {
			parser: {
				javascript: {
					commonjsMagicComments: true,
				},
			},
		},
	});
};
