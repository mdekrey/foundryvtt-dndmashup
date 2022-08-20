import { IconButton, ImageButton } from '@foundryvtt-dndmashup/components';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { PowerUsage } from '../../../item/subtypes/power/dataSourceData';

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

export function PowerFirstRow({
	name,
	usage,
	img,
	hint,
	isReady,
	onClickName,
	onToggleReady,
	onRoll,
	onEdit,
	onRemove,
}: {
	name: string;
	usage: PowerUsage;
	img: string;
	hint?: string;
	isReady: boolean;
	onClickName?: () => void;
	onToggleReady?: () => void;
	onRoll?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
}) {
	return (
		<tr>
			<td
				className={classNames(
					twMerge('flex justify-center items-center w-10 h-10 rounded', usage && usageTypeColors[usage]),
					{ 'opacity-50': !isReady }
				)}>
				{img ? <img src={img} alt="" className="w-8 h-8" /> : null}
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
