const { merge } = require('webpack-merge');
const getWebpackConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
	config = getWebpackConfig(config);
	const result = merge(config, {
		module: {
			parser: {
				javascript: {
					commonjsMagicComments: true,
				},
			},
		},
	});

	const ruleIndex = result.module.rules.findIndex((rule) => rule.test.exec('foo.tsx'));
	const rule = result.module.rules[ruleIndex];
	result.module.rules.splice(ruleIndex, 1, {
		...rule,
		options: {
			...rule.options,
			jsc: {
				...rule.options.jsc,
				target: 'es2016',
			},
		},
	});

	result.output.filename = '[name].js';
	result.output.chunkFilename = '[name].js';

	return result;
};
