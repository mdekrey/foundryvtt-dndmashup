import classNames from 'classnames';
import { pipeJsx, neverEver } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { ActionType, AttackRoll, PowerDocument, PowerEffect, PowerUsage } from '../dataSourceData';
import { Defense, getEffectText } from '@foundryvtt-dndmashup/mashup-rules';
import { D6_2Icon, D6_3Icon, D6_4Icon, D6_5Icon, D6_6Icon } from './icons';
import capitalize from 'lodash/fp/capitalize';
import { AttackTypeInfo } from './AttackTypeInfo';
import { cardRowFormat, FlavorText, RulesText } from '@foundryvtt-dndmashup/components';

export function PowerPreview({ item, simple }: { item: PowerDocument; simple?: boolean }) {
	const applications = useApplicationDispatcher();
	const { name, data: itemData } = item.data;
	const rulesText = itemData.effects
		.flatMap((effect, index) => effectToRules(effect, index === 0))
		.filter((e: null | RuleEntry): e is RuleEntry => e !== null);
	const firstEffect: PowerEffect | null = itemData.effects[0] ?? null;
	const flavorText = itemData.flavorText ? <FlavorText>{itemData.flavorText}</FlavorText> : null;
	function onDetails() {
		applications.launchApplication('powerDetails', { power: item });
	}
	return (
		<section
			className={classNames('bg-white theme-blue-dark', { 'cursor-pointer': simple })}
			onClick={simple ? onDetails : undefined}>
			<header
				className={classNames(
					{
						'theme-green-dark': itemData.usage === 'at-will',
						'theme-red-dark': itemData.usage === 'encounter',
						'theme-gray-dark': itemData.usage === 'daily',
						'theme-orange-dark':
							itemData.usage === 'item' ||
							itemData.usage === 'item-consumable' ||
							itemData.usage === 'item-healing-surge',
					},
					'bg-theme',
					'font-header text-white',
					'flex justify-between items-baseline px-2 pt-0.5'
				)}>
				<span className="text-lg leading-none py-1 font-bold">{name}</span>
				<span className="text-sm leading-tight">{itemData.type}</span>
			</header>
			{pipeJsx(
				simple ? (
					flavorText ?? <></>
				) : (
					<>
						{flavorText}
						<div>
							<p className="font-bold">
								{powerUsage(itemData.usage)}
								{itemData.keywords.length ? <> ✦ {itemData.keywords.map(capitalize).join(', ')}</> : null}
							</p>
							<div className="flex">
								<p className="font-bold flex-grow">{actionType(itemData.actionType)}</p>
								{firstEffect && (
									<p className="flex-grow">
										<AttackTypeInfo typeAndRange={firstEffect.typeAndRange} isBasic={itemData.isBasic} />
									</p>
								)}
							</div>
							{itemData.trigger && <RulesText label="Trigger">{itemData.trigger}</RulesText>}
							{firstEffect?.target && <RulesText label="Target">{firstEffect.target}</RulesText>}
							{firstEffect?.attackRoll && (
								<RulesText label="Attack">{toAttackRollText(firstEffect.attackRoll)}</RulesText>
							)}
							{itemData.prerequisite && <RulesText label="Prerequisite">{itemData.prerequisite}</RulesText>}
							{itemData.requirement && <RulesText label="Requirement">{itemData.requirement}</RulesText>}
						</div>
						{rulesText.map(({ label, text }, index) => (
							<RulesText key={index} label={label || undefined}>
								{text}
							</RulesText>
						))}
						{itemData.special && <RulesText label="Special">{itemData.special}</RulesText>}
					</>
				),
				cardRowFormat
			)}
			{!simple && itemData.sourceId ? (
				<a
					className="px-2 py-1 block"
					href={`https://4e.dekrey.net/legacy/rule/${itemData.sourceId}`}
					target="_blank"
					rel="noreferrer">
					Source
					<ExternalLinkIcon className="h-4 w-4 inline-block align-bottom" aria-hidden="true" />
				</a>
			) : null}
		</section>
	);
}

type RuleEntry = { label?: string | null; text: React.ReactNode };

function effectToRules(effect: PowerEffect, isFirst: boolean): Array<null | RuleEntry> {
	const attackName = effect.name;
	const prefix = attackName ? `${attackName} ` : '';

	const target = effect.target;
	const attackRoll = effect.attackRoll && toAttackRollText(effect.attackRoll);
	const hit = getEffectText(effect.hit);
	const miss = effect.attackRoll && effect.miss ? getEffectText(effect.miss) : '';

	return [
		!isFirst && attackRoll ? { label: `${prefix}Attack`, text: attackRoll } : null,
		!isFirst && target ? { label: `${prefix}Target`, text: target } : null,
		effect.note ? { label: `${prefix}${effect.noteLabel}`, text: effect.note } : null,
		hit ? { label: attackRoll ? `${prefix}Hit` : `${prefix}Effect`, text: hit } : null,
		miss ? { label: `${prefix}Miss`, text: miss } : null,
	];
}

function toAttackRollText(attackRoll: AttackRoll) {
	return `${attackRoll.attack} vs. ${defense(attackRoll.defense)}`;
}

function defense(defense: Defense) {
	return defense.toUpperCase();
}

function powerUsage(usage: PowerUsage) {
	switch (usage) {
		case 'at-will':
			return 'At-Will';
		case 'encounter':
			return 'Encounter';
		case 'daily':
			return 'Daily';
		case 'item':
			return 'Daily (Item)';
		case 'item-consumable':
			return 'Consumable';
		case 'item-healing-surge':
			return 'Healing Surge';
		case 'other':
			return '';
		case 'recharge-2':
			return (
				<>
					Recharge
					<D6_2Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_3Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_4Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_5Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_6Icon className="pl-1 h-4 align-sub inline-block" />
				</>
			);
		case 'recharge-3':
			return (
				<>
					Recharge
					<D6_3Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_4Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_5Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_6Icon className="pl-1 h-4 align-sub inline-block" />
				</>
			);
		case 'recharge-4':
			return (
				<>
					Recharge
					<D6_4Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_5Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_6Icon className="pl-1 h-4 align-sub inline-block" />
				</>
			);
		case 'recharge-5':
			return (
				<>
					Recharge
					<D6_5Icon className="pl-1 h-4 align-sub inline-block" />
					<D6_6Icon className="pl-1 h-4 align-sub inline-block" />
				</>
			);
		case 'recharge-6':
			return (
				<>
					Recharge
					<D6_6Icon className="pl-1 h-4 align-sub inline-block" />
				</>
			);
		default:
			return neverEver(usage);
	}
}

function actionType(actionType: ActionType) {
	switch (actionType) {
		case 'free':
			return 'Free action';
		case 'immediate':
			return 'Immediate action';
		case 'minor':
			return 'Minor action';
		case 'standard':
			return 'Standard action';
		case 'move':
			return 'Move action';
		case 'opportunity':
			return 'Opportunity action';
		case 'none':
			return 'No Action';
		default:
			return neverEver(actionType);
	}
}
