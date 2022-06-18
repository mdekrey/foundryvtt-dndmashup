import { SelectItem } from 'src/components/form-input';
import { PowerUsage } from '../dataSourceData';

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
	{
		value: 'recharge-6',
		key: 'recharge-6',
		label: 'Recharge 6',
	},
	{
		value: 'recharge-5',
		key: 'recharge-5',
		label: 'Recharge 5',
	},
	{
		value: 'recharge-4',
		key: 'recharge-4',
		label: 'Recharge 4',
	},
	{
		value: 'recharge-3',
		key: 'recharge-3',
		label: 'Recharge 3',
	},
	{
		value: 'recharge-2',
		key: 'recharge-2',
		label: 'Recharge 2',
	},
];
