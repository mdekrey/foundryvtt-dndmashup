import { PowerDocument } from '../../item/subtypes/power/dataSourceData';
import { commonActions, isPowerOrCommonAction, CommonAction } from '../actions';
import { ActorDocument } from '../documentType';
import { PowerTable } from './power-components';

const powerGroups: {
	key: React.Key;
	label: string;
	className?: string;
	filter: (item: PowerDocument | CommonAction) => boolean;
}[] = [
	{
		key: 'common-action',
		label: 'Common Action',
		className: (<i className="theme-green-blue" />).props.className,
		filter: (item) => !isPowerOrCommonAction(item),
	},
	{
		key: 'at-will-power',
		label: 'At-Will Power',
		className: (<i className="theme-green-dark" />).props.className,
		filter: (item) => isPowerOrCommonAction(item) && item.system.usage === 'at-will',
	},
	{
		key: 'encounter-power',
		label: 'Encounter Power',
		className: (<i className="theme-red-dark" />).props.className,
		filter: (item) => isPowerOrCommonAction(item) && item.system.usage === 'encounter',
	},
	{
		key: 'daily-power',
		label: 'Daily Power',
		className: (<i className="theme-gray-dark" />).props.className,
		filter: (item) => isPowerOrCommonAction(item) && item.system.usage === 'daily',
	},
	{
		key: 'item-daily-powers',
		label: 'Item Daily Powers (or Item Healing Surge)',
		className: (<i className="theme-orange-dark" />).props.className,
		filter: (item) =>
			isPowerOrCommonAction(item) && (item.system.usage === 'item' || item.system.usage === 'item-healing-surge'),
	},
	{
		key: 'item-consumable',
		label: 'Consumables',
		className: (<i className="theme-orange-dark" />).props.className,
		filter: (item) => isPowerOrCommonAction(item) && item.system.usage === 'item-consumable',
	},
];

export function Powers({ actor }: { actor: ActorDocument }) {
	const powers = [...commonActions, ...actor.allPowers(false)];
	const groups = powerGroups
		.map(({ filter, ...others }) => ({
			...others,
			items: powers.filter(filter),
		}))
		.filter(({ items }) => items.length > 0);
	const other = powers.filter((item) => !powerGroups.some(({ filter }) => filter(item)));
	return (
		<>
			{groups.map(({ key, label, items, className }) => (
				<PowerTable key={key} actor={actor} powers={items} title={label} className={className} />
			))}
			{other.length ? <PowerTable actor={actor} powers={other} title="Other Power" /> : null}
		</>
	);
}
