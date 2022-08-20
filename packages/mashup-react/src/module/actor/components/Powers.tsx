import noop from 'lodash/fp/noop';
import { PowerDocument } from '../../item/subtypes/power/dataSourceData';
import { ActorDocument } from '../documentType';
import { CommonAction, isPower, PowerTable } from './power-components';

const commonActions: CommonAction[] = [
	{
		name: 'Total Defense',
		img: 'icons/magic/defensive/shield-barrier-blue.webp',
		action: 'standard',
		usage: 'at-will',
		hint: '+2 to all Defenses until your next turn',
		isReady: () => true,
		use: noop,
	},
	{
		name: 'Second Wind',
		img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
		action: 'standard',
		usage: 'encounter',
		hint: 'Once per encounter, spend a healing surge and defend yourself',
		isReady: (actor) => !actor.data.data.health.secondWindUsed,
		setReady: (actor, ready) => {
			actor.update({ 'data.health.secondWindUsed': !ready }, {});
		},
		use: noop,
	},
	{
		name: 'Spend Action Point',
		img: 'icons/skills/movement/arrow-upward-yellow.webp',
		action: 'free',
		usage: 'encounter',
		hint: 'Once per encounter, spend an action point to gain an extra turn',
		isReady: (actor) => !actor.data.data.actionPoints.usedThisEncounter,
		setReady: (actor, ready) => {
			actor.update({ 'data.actionPoints.usedThisEncounter': !ready }, {});
		},
		use: noop,
	},
];

const powerGroups: {
	key: React.Key;
	label: string;
	className?: string;
	filter: (item: PowerDocument | CommonAction) => boolean;
}[] = [
	{
		key: 'common-action',
		label: 'Common Action',
		className: 'theme-green-blue',
		filter: (item) => !isPower(item),
	},
	{
		key: 'at-will-power',
		label: 'At-Will Power',
		className: 'theme-green-dark',
		filter: (item) => isPower(item) && item.data.data.usage === 'at-will',
	},
	{
		key: 'encounter-power',
		label: 'Encounter Power',
		className: 'theme-red-dark',
		filter: (item) => isPower(item) && item.data.data.usage === 'encounter',
	},
	{
		key: 'daily-power',
		label: 'Daily Power',
		className: 'theme-gray-dark',
		filter: (item) => isPower(item) && item.data.data.usage === 'daily',
	},
];

export function Powers({ actor }: { actor: ActorDocument }) {
	const powers = [...commonActions, ...actor.allPowers()];
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
