import { IconButton, ImageButton } from '@foundryvtt-dndmashup/components';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { PowerUsage } from '../../../item/subtypes/power/dataSourceData';

const usageTypeColors: Record<PowerUsage, string> = {
	'at-will': (<i className="bg-green-dark" />).props.className,
	encounter: (<i className="bg-red-dark" />).props.className,
	daily: (<i className="bg-gray-dark" />).props.className,
	item: (<i className="bg-orange-dark" />).props.className,
	'item-consumable': (<i className="bg-orange-dark" />).props.className,
	'item-healing-surge': (<i className="bg-orange-dark" />).props.className,
	other: (<i className="bg-blue-dark" />).props.className,
};

export function PowerFirstRow({
	uuid,
	name,
	usage,
	img,
	hint,
	isReady,
	isSubPower = false,
	hasSubPowers = false,
	onClickName,
	onToggleReady,
	onRoll,
	onShareToChat,
	onEdit,
	onRemove,
}: {
	uuid?: string;
	name: string;
	usage: PowerUsage;
	img: string;
	hint?: string;
	isReady: boolean;
	isSubPower?: boolean;
	hasSubPowers?: boolean;
	onClickName?: () => void;
	onToggleReady?: () => void;
	onRoll?: () => void;
	onShareToChat?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
}) {
	return (
		<tr>
			<td
				className={classNames(twMerge('flex flex-row items-stretch gap-2'), {
					'opacity-50': !isReady,
					'ml-2': isSubPower,
				})}
				draggable={true}
				onDragStart={handleDragStart}>
				<div
					className={classNames('p-1 flex-shrink-0', usage && usageTypeColors[usage], {
						rounded: !isSubPower && !hasSubPowers,
						'rounded-t rounded-bl': !isSubPower && hasSubPowers,
					})}>
					{img ? (
						<img
							src={img}
							alt=""
							className={classNames('pointer-events-none', { 'w-8 h-8': !isSubPower, 'w-6 h-6': isSubPower })}
						/>
					) : null}
				</div>
				{onClickName ? (
					<button
						type="button"
						className="focus:ring-blue-bright-600 focus:ring-1 flex-grow text-left whitespace-nowrap"
						onClick={onClickName}>
						{name}
					</button>
				) : (
					<span className="self-center">{name}</span>
				)}
			</td>
			<td className={classNames({ 'opacity-50': !isReady })}>{hint}</td>
			<td className="text-right w-32">
				<div className={classNames('flex gap-1 justify-end', { 'opacity-50': !isReady })}>
					<IconButton
						className={classNames('w-7 h-7', { invisible: !onToggleReady })}
						title="Ready"
						onClick={onToggleReady}
						iconClassName="fas fa-sun"
					/>
					<ImageButton
						className={classNames('w-7 h-7', { invisible: !onRoll })}
						title="Roll"
						onClick={onRoll}
						src="/icons/svg/d20-black.svg"
					/>
					<IconButton
						className={classNames('w-7 h-7', { invisible: !onShareToChat })}
						title="Share to Chat"
						iconClassName="fas fa-comments"
						onClick={onShareToChat}
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

	function handleDragStart(ev: React.DragEvent) {
		if (!uuid) console.warn('TODO: no uuid - common action?', name);
		ev.dataTransfer.setData(
			'text/plain',
			JSON.stringify({
				type: 'Item',
				uuid,
			})
		);
	}
}
