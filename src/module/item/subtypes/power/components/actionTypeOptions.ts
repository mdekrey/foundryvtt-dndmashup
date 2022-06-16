import { SelectItem } from 'src/components/form-input';
import { ActionType } from '../dataSourceData';

export const actionTypeOptions: SelectItem<ActionType>[] = [
	{
		value: 'standard',
		key: 'standard',
		label: 'Standard',
	},
	{
		value: 'move',
		key: 'move',
		label: 'Move',
	},
	{
		value: 'minor',
		key: 'minor',
		label: 'Minor',
	},
	{
		value: 'free',
		key: 'free',
		label: 'Free',
	},
	{
		value: 'opportunity',
		key: 'opportunity',
		label: 'Opportunity',
	},
	{
		value: 'immediate',
		key: 'immediate',
		label: 'Immediate',
	},
];
