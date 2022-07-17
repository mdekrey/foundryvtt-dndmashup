// rules can't go directly in the main .eslintrc.cjs - see https://stackoverflow.com/a/68069447/195653
module.exports = {
	rules: {
		'prefer-template': 'error',
		'@typescript-eslint/no-shadow': 0,
		'import/prefer-default-export': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'no-nested-ternary': 0,
		'no-unneeded-ternary': 0,
		'global-require': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never', // TODO: maybe later?
			},
		],

		// React recommended overrides:
		'react/jsx-pascal-case': 0,
		'react/jsx-no-useless-fragment': 0, // TODO: maybe later?
		'no-useless-rename': 0, // TODO: maybe later?
		'react-hooks/exhaustive-deps': 0, // TODO: later
		'jsx-a11y/alt-text': 0, // TODO: maybe later?

		// TODO: maybe later?
		'no-case-declarations': 0,

		// foundry has a lot of complex types that we sometimes just need `any` for
		'@typescript-eslint/no-explicit-any': 0,
	},
};
