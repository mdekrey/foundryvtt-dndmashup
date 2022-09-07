import { triggersRegistry } from './registry';

declare global {
	interface Triggers {
		spendActionPoint: null;
		anAllySpendsAnActionPoint: null;
	}
}

triggersRegistry.spendActionPoint = {
	defaultParameter: null,
	text: () => 'when you spend an action point',
	editor: () => <></>,
};

triggersRegistry.anAllySpendsAnActionPoint = {
	defaultParameter: null,
	text: () => 'when an ally spends an action point to take an extra action',
	editor: () => <></>,
};
