/* eslint-disable */
export default {
	displayName: 'foundry-system',
	preset: '../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	transform: {
		'^.+\\.[tj]s$': '@swc/jest',
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/packages/foundry-system',
};
