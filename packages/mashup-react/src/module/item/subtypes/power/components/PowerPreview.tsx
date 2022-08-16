import classNames from 'classnames';
import { pipeJsx, recurse, mergeStyles, neverEver } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { ActionType, AttackRoll, PowerDocument, PowerEffect, PowerUsage } from '../dataSourceData';
import { ApplicableEffect, DamageEffect, HealingEffect } from '../../../../../effects';
import { Defense } from '@foundryvtt-dndmashup/mashup-rules';
import { D6_2Icon, D6_3Icon, D6_4Icon, D6_5Icon, D6_6Icon } from './icons';
import capitalize from 'lodash/fp/capitalize';
import { AttackTypeInfo } from './AttackTypeInfo';

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
		<section className={classNames('bg-white', { 'cursor-pointer': simple })} onClick={simple ? onDetails : undefined}>
			<header
				className={classNames(
					{
						'bg-green-dark': itemData.usage === 'at-will',
						'bg-red-dark': itemData.usage === 'encounter',
						'bg-gray-dark': itemData.usage === 'daily',
						'bg-orange-dark': itemData.usage === 'item',
						'bg-blue-dark':
							itemData.usage !== 'at-will' &&
							itemData.usage !== 'encounter' &&
							itemData.usage !== 'daily' &&
							itemData.usage !== 'item',
					},
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
					</>
				),
				recurse(mergeStyles(<p className="even:bg-gradient-to-r from-tan-fading px-2 font-info leading-snug" />))
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
	const hit = toNestedEffects(effect.hit);
	const miss = effect.attackRoll && effect.miss ? toNestedEffects(effect.miss) : '';

	return [
		!isFirst && attackRoll ? { label: `${prefix}Attack`, text: attackRoll } : null,
		!isFirst && target ? { label: `${prefix}Target`, text: target } : null,
		effect.note ? { label: `${prefix}${effect.noteLabel}`, text: effect.note } : null,
		hit ? { label: attackRoll ? `${prefix}Hit` : `${prefix}Effect`, text: hit } : null,
		miss ? { label: `${prefix}Miss`, text: miss } : null,
	];
}

function toNestedEffects(effect: ApplicableEffect): string {
	return [
		effect.damage && damageEffectText(effect.damage),
		effect.healing && healingEffectText(effect.healing),
		effect.text,
	]
		.filter(Boolean)
		.join(' ');
}

function damageEffectText(effect: DamageEffect) {
	return [effect.damage, oxfordComma(effect.damageTypes ?? []), 'damage.'].filter(Boolean).join(' ');
}

function healingEffectText(effect: HealingEffect) {
	const prefix = effect.spendHealingSurge
		? 'The target may spend a healing surge. If they do, the target'
		: 'The target';
	const verb = effect.isTemporary ? 'gains temporary hit points' : 'regains hit points';
	const link = 'equal to';
	const amount = [effect.healingSurge ? 'its healing surge value' : '', effect.healing].filter(Boolean).join(' plus ');

	return `${prefix} ${verb} ${link} ${amount}.`;
}

function oxfordComma(parts: string[]) {
	if (parts.length <= 2) return parts.join(' and ');
	return `${parts.slice(parts.length - 1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function toAttackRollText(attackRoll: AttackRoll) {
	return `${attackRoll.attack} vs. ${defense(attackRoll.defense)}`;
}

export function FlavorText({ children, className, ...props }: JSX.IntrinsicElements['p']) {
	return (
		<p className={classNames(className, 'italic font-flavor')} {...props}>
			{children}
		</p>
	);
}

export function RulesText({
	label,
	children,
	className,
}: {
	label?: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return label && children ? (
		<div className={className}>
			<span
				className={classNames('font-bold float-left pr-1', {
					'pl-8': label.startsWith('\t\t'),
					'pl-4': label.startsWith('\t') && !label.startsWith('\t\t'),
				})}>
				{label.trimStart()}:
			</span>
			{children}
		</div>
	) : label ? (
		<div className={classNames('font-bold', className)}>{label}</div>
	) : (
		<div className={className}>{children}</div>
	);
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
			return '';
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
		default:
			return neverEver(actionType);
	}
}
