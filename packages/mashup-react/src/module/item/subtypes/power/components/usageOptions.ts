import { SelectItem } from '@foundryvtt-dndmashup/components';
import { PowerUsage } from '../dataSourceData';

export const usageOptions: SelectItem<PowerUsage>[] = [
	{
		value: 'at-will',
		key: 'at-will',
		label: 'At-Will',
		typeaheadLabel: 'At-Will',
	},
	{
		value: 'encounter',
		key: 'encounter',
		label: 'Encounter',
		typeaheadLabel: 'Encounter',
	},
	{
		value: 'daily',
		key: 'daily',
		label: 'Daily',
		typeaheadLabel: 'Daily',
	},
	{
		value: 'item',
		key: 'item',
		label: 'Item Daily',
		typeaheadLabel: 'Item Daily',
	},
	{
		value: 'item-consumable',
		key: 'item-consumable',
		label: 'Consumable',
		typeaheadLabel: 'Consumable',
	},
	{
		value: 'item-healing-surge',
		key: 'item-healing-surge',
		label: 'Healing Surge (Item)',
		typeaheadLabel: 'Healing Surge (Item)',
	},
	{
		value: 'other',
		key: 'other',
		label: 'Other',
		typeaheadLabel: 'Other',
	},
];
