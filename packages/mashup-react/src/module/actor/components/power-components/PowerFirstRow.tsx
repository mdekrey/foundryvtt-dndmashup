import { IconButton, ImageButton } from '@foundryvtt-dndmashup/components';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { PowerUsage } from '../../../item/subtypes/power/dataSourceData';

const usageTypeColors: Record<PowerUsage, string> = {
	'at-will': (<i className="bg-green-dark" />).props.className,
	encounter: (<i className="bg-red-dark" />).props.className,
	daily: (<i className="bg-gray-dark" />).props.className,
	item: (<i className="bg-orange-dark" />).props.className,
	'item-healing-surge': (<i className="bg-orange-dark" />).props.className,
	other: (<i className="bg-blue-dark" />).props.className,
	'recharge-2': (<i className="bg-blue-dark" />).props.className,
	'recharge-3': (<i className="bg-blue-dark" />).props.className,
	'recharge-4': (<i className="bg-blue-dark" />).props.className,
	'recharge-5': (<i className="bg-blue-dark" />).props.className,
	'recharge-6': (<i className="bg-blue-dark" />).props.className,
};

export function PowerFirstRow({
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
				className={classNames(twMerge('flex justify-center items-center', usage && usageTypeColors[usage]), {
					'opacity-50': !isReady,
					'w-10 h-10': !isSubPower,
					'ml-2 w-8 h-8': isSubPower,
					rounded: !isSubPower && !hasSubPowers,
					'rounded-t rounded-bl': !isSubPower && hasSubPowers,
				})}>
				{img ? (
					<img src={img} alt="" className={classNames({ 'w-8 h-8': !isSubPower, 'w-6 h-6': isSubPower })} />
				) : null}
			</td>
			<td className={classNames('px-1 whitespace-nowrap', { 'opacity-50': !isReady })}>
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
}
