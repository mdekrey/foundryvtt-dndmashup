import { ImageButton } from '@foundryvtt-dndmashup/components';
import { ItemTable, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { useChatMessageDispatcher } from '../../chat';
import { PowerPreview } from '../../item/subtypes/power/components/PowerPreview';
import { PowerDocument } from '../../item/subtypes/power/dataSourceData';
import { ActorDocument } from '../documentType';

const powerGroups: {
	key: React.Key;
	label: string;
	className?: string;
	filter: (item: PowerDocument) => boolean;
}[] = [
	{
		key: 'at-will-power',
		label: 'At-Will Power',
		className: 'theme-green-dark',
		filter: (item) => item.data.data.usage === 'at-will',
	},
	{
		key: 'encounter-power',
		label: 'Encounter Power',
		className: 'theme-red-dark',
		filter: (item) => item.data.data.usage === 'encounter',
	},
	{
		key: 'daily-power',
		label: 'Daily Power',
		className: 'theme-gray-dark',
		filter: (item) => item.data.data.usage === 'daily',
	},
];

export function Powers({ actor }: { actor: ActorDocument }) {
	const powers = actor.allPowers();
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
				<ItemTable
					key={key}
					items={items}
					title={label}
					className={className}
					passedProps={{ actor }}
					header={PowerHeader}
					body={PowerBody}
					detail={PowerDetail}
					addedCellCount={1}
				/>
			))}
			{other.length ? (
				<ItemTable
					items={other}
					title="Other Power"
					passedProps={{ actor }}
					header={PowerHeader}
					body={PowerBody}
					detail={PowerDetail}
					addedCellCount={1}
				/>
			) : null}
		</>
	);
}

function PowerHeader() {
	return <th className="text-right"></th>;
}

function PowerBody({ item, actor }: { item: PowerDocument; actor: ActorDocument }) {
	const dispatch = useChatMessageDispatcher();

	return (
		<td className="text-right">
			<ImageButton src="/icons/svg/d20-black.svg" onClick={shareToChat} />
		</td>
	);

	async function shareToChat() {
		dispatch.sendChatMessage('power', actor, { item });
	}
}

function PowerDetail({ item }: { item: PowerDocument }) {
	return (
		<div>
			<div className="max-w-md mx-auto border-4 border-white">
				<PowerPreview item={item} />
			</div>
		</div>
	);
}
