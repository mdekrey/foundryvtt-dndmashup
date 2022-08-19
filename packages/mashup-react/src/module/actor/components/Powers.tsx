import { IconButton, ImageButton, Table } from '@foundryvtt-dndmashup/components';
import classNames from 'classnames';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useChatMessageDispatcher } from '../../chat';
import { PowerPreview } from '../../item/subtypes/power/components/PowerPreview';
import { ActionType, PowerDocument, PowerUsage } from '../../item/subtypes/power/dataSourceData';
import { ActorDocument } from '../documentType';

const usageTypeColors: Record<PowerUsage, string> = {
	'at-will': (<i className="bg-green-dark" />).props.className,
	encounter: (<i className="bg-red-dark" />).props.className,
	daily: (<i className="bg-gray-dark" />).props.className,
	item: (<i className="bg-orange-dark" />).props.className,
	other: (<i className="bg-blue-dark" />).props.className,
	'recharge-2': (<i className="bg-blue-dark" />).props.className,
	'recharge-3': (<i className="bg-blue-dark" />).props.className,
	'recharge-4': (<i className="bg-blue-dark" />).props.className,
	'recharge-5': (<i className="bg-blue-dark" />).props.className,
	'recharge-6': (<i className="bg-blue-dark" />).props.className,
};

type CommonAction = {
	name: string;
	action: ActionType;
	usage: PowerUsage;
	img: string;
	hint: string;
};
const commonActions: CommonAction[] = [
	{
		name: 'Total Defense',
		img: 'icons/magic/defensive/shield-barrier-blue.webp',
		action: 'standard',
		usage: 'at-will',
		hint: '+2 to all Defenses until your next turn',
	},
	{
		name: 'Second Wind',
		img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
		action: 'standard',
		usage: 'encounter',
		hint: 'Once per encounter, spend a healing surge and defend yourself',
	},
	{
		name: 'Spend Action Point',
		img: 'icons/skills/movement/arrow-upward-yellow.webp',
		action: 'free',
		usage: 'encounter',
		hint: 'Once per encounter, spend an action point to gain an extra turn',
	},
];

function isPower(item: PowerDocument | CommonAction): item is PowerDocument {
	return 'id' in item;
}

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

function PowerTable({
	actor,
	powers,
	className,
	title,
}: {
	actor: ActorDocument;
	powers: (PowerDocument | CommonAction)[];
	className?: string;
	title: string;
}) {
	return (
		<Table className={className}>
			<Table.HeaderRow>
				<th className="w-10" />
				<th className="pl-1 text-left">{title}</th>
				<th></th>
				<th className="w-0" />
			</Table.HeaderRow>
			{powers.map((power) => (
				<Row key={isPower(power) ? power.id : power.name} power={power} actor={actor} />
			))}
		</Table>
	);
}

function Row({ actor, power }: { actor: ActorDocument; power: PowerDocument | CommonAction }) {
	return 'id' in power ? (
		<PowerRow actor={actor} power={power} />
	) : (
		<PowerFirstRow name={power.name} img={power.img} hint={power.hint} usage={power.usage} />
	);
}

function PowerRow({ actor, power }: { actor: ActorDocument; power: PowerDocument }) {
	const detailRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useChatMessageDispatcher();

	return (
		<Table.Body>
			<PowerFirstRow
				name={power.name ?? ''}
				usage={power.data.data.usage}
				img={power.img ?? ''}
				hint=""
				onClickName={toggle}
				onEdit={edit}
				onRemove={remove}
				onRoll={shareToChat}
			/>
			<tr>
				<td></td>
				<td colSpan={2}>
					<div ref={detailRef} className="overflow-hidden max-h-0 transition-all duration-300">
						<div className="max-w-md mx-auto border-4 border-white">
							<PowerPreview item={power} />
						</div>
					</div>
				</td>
				<td></td>
			</tr>
		</Table.Body>
	);

	function edit() {
		power.showEditDialog();
	}
	function remove() {
		power.delete();
	}
	async function shareToChat() {
		dispatch.sendChatMessage('power', actor, { item: power });
	}
	function toggle() {
		if (!detailRef.current) return;
		if (detailRef.current.style.maxHeight) detailRef.current.style.maxHeight = '';
		else detailRef.current.style.maxHeight = `${detailRef.current.scrollHeight}px`;
	}
}

function PowerFirstRow({
	name,
	usage,
	img,
	hint,
	onClickName,
	onRoll,
	onEdit,
	onRemove,
}: {
	name: string;
	usage: PowerUsage;
	img: string;
	hint?: string;
	onClickName?: () => void;
	onRoll?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
}) {
	return (
		<tr>
			<td className={twMerge('flex justify-center items-center w-10 h-10 rounded', usage && usageTypeColors[usage])}>
				{img ? <img src={img} alt="" className="w-8 h-8" /> : null}
			</td>
			<td className="px-1 whitespace-nowrap">
				{onClickName ? (
					<button
						type="button"
						className="focus:ring-blue-bright-600 focus:ring-1 w-full h-full text-left whitespace-nowrap"
						onClick={onClickName}>
						{name}
					</button>
				) : (
					name
				)}
			</td>
			<td>{hint}</td>
			<td className="text-right w-24">
				<div className="flex gap-1 justify-end">
					<ImageButton
						className={classNames('w-7 h-7', { invisible: !onRoll })}
						title="Roll"
						onClick={onRoll}
						src="/icons/svg/d20-black.svg"
					/>
					<IconButton
						className={classNames('w-7 h-7', { invisible: !onEdit })}
						title="Edit"
						onClick={onEdit}
						iconClassName="fas fa-edit"
					/>
					<IconButton
						className={classNames('w-7 h-7', { invisible: !onRemove })}
						title="Delete"
						onClick={onRemove}
						iconClassName="fas fa-trash"
					/>
				</div>
			</td>
		</tr>
	);
}
