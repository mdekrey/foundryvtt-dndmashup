const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('rollup-plugin-replace');

module.exports = (isProduction) => ({
	input: 'src/module/foundryvtt-dndmashup.ts',
	output: {
		dir: 'dist/module',
		format: 'es',
		sourcemap: true,
	},
	plugins: [
		nodeResolve(),
		typescript(),
		commonjs(),
		replace({ 'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development') }),
	],
});
