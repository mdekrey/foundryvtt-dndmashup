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
	{
		value: 'recharge-6',
		key: 'recharge-6',
		label: 'Recharge 6',
		typeaheadLabel: 'Recharge 6',
	},
	{
		value: 'recharge-5',
		key: 'recharge-5',
		label: 'Recharge 5',
		typeaheadLabel: 'Recharge 5',
	},
	{
		value: 'recharge-4',
		key: 'recharge-4',
		label: 'Recharge 4',
		typeaheadLabel: 'Recharge 4',
	},
	{
		value: 'recharge-3',
		key: 'recharge-3',
		label: 'Recharge 3',
		typeaheadLabel: 'Recharge 3',
	},
	{
		value: 'recharge-2',
		key: 'recharge-2',
		label: 'Recharge 2',
		typeaheadLabel: 'Recharge 2',
	},
];
