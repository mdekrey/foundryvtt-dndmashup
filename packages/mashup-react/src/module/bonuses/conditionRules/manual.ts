import { ruleResultIndeterminate } from '../constants';
import { conditionsRegistry } from '../registry';

export function manual(): typeof ruleResultIndeterminate {
	return ruleResultIndeterminate;
}

declare global {
	interface ConditionRules {
		manual: { conditionText: string };
	}
}

conditionsRegistry.manual = { ruleText: (params) => params?.conditionText ?? '<condition>', rule: manual };
