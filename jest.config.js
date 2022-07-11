export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/foundry/test/tsconfig.json',
		},
	},
};
