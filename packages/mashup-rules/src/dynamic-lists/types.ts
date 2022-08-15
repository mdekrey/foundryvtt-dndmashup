import { ConditionRuleContext, SimpleConditionRule } from '../conditions';
import { DynamicListTarget } from './constants';

export type DynamicListEntry = {
	target: DynamicListTarget;
	entry: string;
	condition: SimpleConditionRule;
	disabled?: boolean;
};

export type DynamicListEntryWithContext = DynamicListEntry & {
	context: Partial<ConditionRuleContext>;
};
