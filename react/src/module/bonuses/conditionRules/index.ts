import { conditionsRegistry } from '../registry';
import { proficientIn } from './proficient';
import { bloodied } from './bloodied';

declare global {
	interface ConditionRules {
		proficientIn: never;
		bloodied: never;
	}
}

conditionsRegistry.proficientIn = {
	label: 'When you are proficient with the item',
	display: 'when you are proficient with the item',
	rule: proficientIn,
};

conditionsRegistry.bloodied = { label: 'When you are bloodied', display: 'when you are bloodied', rule: bloodied };
