const tsPaths = require('rollup-plugin-tsconfig-paths').default;
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('rollup-plugin-replace');

module.exports = (isProduction) => ({
	input: `${__dirname}/src/module/foundryvtt-dndmashup.ts`,
	output: {
		dir: `${__dirname}/out/`,
		format: 'es',
		sourcemap: true,
	},
	plugins: [
		tsPaths({ tsConfigPath: `${__dirname}/tsconfig.rollup.json` }),
		nodeResolve(),
		typescript({ tsconfig: `${__dirname}/tsconfig.rollup.json` }),
		commonjs(),
		replace({ 'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development') }),
	],
});
