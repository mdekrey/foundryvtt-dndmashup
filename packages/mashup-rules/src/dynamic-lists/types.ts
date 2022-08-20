import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ConditionRuleContext, SimpleConditionRule } from '../conditions';
import { DynamicListTarget } from './constants';

export type DynamicListEntry = {
	target: DynamicListTarget;
	entry: string;
	condition: SimpleConditionRule;
	disabled?: boolean;
};

export type DynamicListEntryWithSource = DynamicListEntry & {
	source: SimpleDocument;
};

export type DynamicListEntryWithContext = DynamicListEntry & {
	context: Partial<ConditionRuleContext>;
};

export type FullDynamicListEntry = DynamicListEntryWithSource & DynamicListEntryWithContext;
