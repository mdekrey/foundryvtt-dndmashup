const { join } = require('path');
const tailwindcss = require('tailwindcss');

module.exports = {
	plugins: [
		require('postcss-import'),
		require('tailwindcss/nesting'),
		tailwindcss(join(__dirname, `./tailwind.config.cjs`)),
		require('autoprefixer'),
	],
};
