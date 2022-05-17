module.exports = {
	root: true,

	parserOptions: {
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
	},
	ignorePatterns: ['node_modules/'],

	env: {
		browser: true,
	},

	extends: ['plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'plugin:prettier/recommended'],

	plugins: ['prettier', 'jest'],

	rules: {
		'@typescript-eslint/no-shadow': 0,
		'import/prefer-default-export': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'no-nested-ternary': 0,
		'no-unneeded-ternary': 0,
		'global-require': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'comma-dangle': ['error', 'always-multiline'],
	},

	overrides: [
		{
			files: ['./*.cjs'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
};
