import { triggersRegistry } from './registry';

declare global {
	interface Triggers {
		startOfTurn: null;
		endOfTurn: null;
	}
}

triggersRegistry.startOfTurn = {
	defaultParameter: null,
	text: () => 'at the start of your turn',
	editor: () => <></>,
};

triggersRegistry.endOfTurn = {
	defaultParameter: null,
	text: () => 'at the end of your turn',
	editor: () => <></>,
};
