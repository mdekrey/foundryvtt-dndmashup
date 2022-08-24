import { SelectItem } from '@foundryvtt-dndmashup/components';
import { ActionType } from '../dataSourceData';

export const actionTypeOptions: SelectItem<ActionType>[] = [
	{
		value: 'standard',
		key: 'standard',
		label: 'Standard',
		typeaheadLabel: 'Standard',
	},
	{
		value: 'move',
		key: 'move',
		label: 'Move',
		typeaheadLabel: 'Move',
	},
	{
		value: 'minor',
		key: 'minor',
		label: 'Minor',
		typeaheadLabel: 'Minor',
	},
	{
		value: 'free',
		key: 'free',
		label: 'Free',
		typeaheadLabel: 'Free',
	},
	{
		value: 'opportunity',
		key: 'opportunity',
		label: 'Opportunity',
		typeaheadLabel: 'Opportunity',
	},
	{
		value: 'immediate',
		key: 'immediate',
		label: 'Immediate',
		typeaheadLabel: 'Immediate',
	},
	{
		value: 'none',
		key: 'none',
		label: 'None',
		typeaheadLabel: 'None',
	},
];
