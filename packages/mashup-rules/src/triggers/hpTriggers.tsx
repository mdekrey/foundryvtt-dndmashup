import { triggersRegistry } from './registry';

declare global {
	interface Triggers {
		youBecomeBloodied: null;
		youDropTo0Hp: null;
		yourAttackCausesACreatureToBecomeBloodied: null;
		yourAttackCausesACreatureToDropTo0Hp: null;
	}
}

triggersRegistry.youBecomeBloodied = {
	defaultParameter: null,
	text: () => 'you become bloodied',
	editor: () => <></>,
};

triggersRegistry.youDropTo0Hp = {
	defaultParameter: null,
	text: () => 'you drop to 0 hp',
	editor: () => <></>,
};

triggersRegistry.yourAttackCausesACreatureToBecomeBloodied = {
	defaultParameter: null,
	text: () => 'your attack causes a creature to become bloodied',
	editor: () => <></>,
};

triggersRegistry.yourAttackCausesACreatureToDropTo0Hp = {
	defaultParameter: null,
	text: () => 'your attack causes a creature to drop to 0 hp',
	editor: () => <></>,
};
