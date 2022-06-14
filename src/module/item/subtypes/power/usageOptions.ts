import { SelectItem } from 'src/components/form-input';
import { PowerUsage } from './dataSourceData';

export const usageOptions: SelectItem<PowerUsage>[] = [
	{
		value: 'at-will',
		key: 'at-will',
		label: 'At-Will',
	},
	{
		value: 'encounter',
		key: 'encounter',
		label: 'Encounter',
	},
	{
		value: 'daily',
		key: 'daily',
		label: 'Daily',
	},
	{
		value: 'item',
		key: 'item',
		label: 'Item',
	},
	// TODO - recharge?
];
