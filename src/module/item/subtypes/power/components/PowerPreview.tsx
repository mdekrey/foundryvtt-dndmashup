import { MashupPower } from '../config';
import classNames from 'classnames';
import { pipeJsx } from 'src/core/jsx/pipeJsx';
import { recurse } from 'src/core/jsx/recurse';
import { mergeStyles } from 'src/core/jsx/mergeStyles';
import { ActionType, ApplicableEffect, AttackRoll, EffectTypeAndRange, PowerUsage } from '../dataSourceData';
import { neverEver } from 'src/core/neverEver';
import { isAttackEffect, isTargetEffect, or } from './sheetLenses';
import { Defense } from 'src/types/types';

export function PowerPreview({ item }: { item: MashupPower }) {
	const { name, data: itemData } = item.data;
	const primaryAttack = itemData.effect.effects.find(isAttackEffect);
	const rulesText = itemData.effect.effects
		.flatMap((effect, index) =>
			effectToRules(effect, itemData.effect.effects.slice(0, index).filter(or(isAttackEffect, isTargetEffect)).length)
		)
		.filter((e: null | RuleEntry): e is RuleEntry => e !== null);
	return (
		<section className="bg-white">
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
				<>
					{itemData.flavorText && <FlavorText>{itemData.flavorText}</FlavorText>}
					<div>
						<p className="font-bold">
							{powerUsage(itemData.usage)}
							{itemData.keywords.length ? <> ✦ {itemData.keywords.join(', ')}</> : null}
						</p>
						<div className="flex">
							<p className="font-bold w-40">{actionType(itemData.actionType)}</p>
							<p>
								<AttackTypeIcon
									attackType={itemData.effect.typeAndRange.type}
									isBasic={itemData.isBasic}
									className="mt-1 h-4 align-top inline-block"
								/>{' '}
								<span className="font-bold">{attackType(itemData.effect.typeAndRange.type)}</span>
							</p>
						</div>
						{itemData.trigger && <RulesText label="Trigger">{itemData.trigger}</RulesText>}
						{itemData.effect.target && <RulesText label="Target">{itemData.effect.target}</RulesText>}
						{primaryAttack && <RulesText label="Attack">{toAttackRollText(primaryAttack.attackRoll)}</RulesText>}
						{itemData.prerequisite && <RulesText label="Prerequisite">{itemData.prerequisite}</RulesText>}
						{itemData.requirement && <RulesText label="Requirement">{itemData.requirement}</RulesText>}
					</div>
					{rulesText.map(({ label, text }, index) => (
						<RulesText key={index} label={label || undefined}>
							{text}
						</RulesText>
					))}
				</>,
				recurse(mergeStyles(<p className="even:bg-gradient-to-r from-tan-fading px-2 font-info" />))
			)}
		</section>
	);
}

type RuleEntry = { label?: string | null; text: React.ReactNode };

function effectToRules(effect: ApplicableEffect, attackIndex: number): Array<null | RuleEntry> {
	const attackName = toIndexName(attackIndex);
	const prefix = attackName ? `${attackName} ` : '';
	switch (effect.type) {
		case 'attack':
			const [hit, hitEffects] = toNestedEffects(effect.hit, attackIndex + 1);
			const [miss] = toNestedEffects(effect.miss);
			console.log(hit, hitEffects, miss);
			return [
				attackIndex === 0 ? null : { label: `${prefix}Attack`, text: toAttackRollText(effect.attackRoll) },
				hit ? { label: 'Hit', text: hit } : null,
				...hitEffects,
				miss ? { label: 'Miss', text: miss } : null,
			];
		case 'text':
			return [{ label: 'Effect', text: effect.text }];
		case 'target':
			return [
				{ label: `${prefix}Target`, text: effect.target },
				...effect.effects.flatMap((e) => effectToRules(e, attackIndex)),
				// TODO: typeAndRange
			];
		case 'damage':
		case 'healing':
		case 'half-damage':
			return [];
		default:
			return neverEver(effect);
	}
}

function toNestedEffects(effects: ApplicableEffect[], attackIndex?: number): [string, Array<null | RuleEntry>] {
	const results = effects.map((effect) => {
		switch (effect.type) {
			case 'damage':
				return [effect.damage, effect.damageType === 'normal' ? '' : effect.damageType, 'damage.']
					.filter(Boolean)
					.join(' ');
			case 'half-damage':
				return 'Half damage.';
			case 'healing':
				return [];
			case 'text':
				return effect.text;
			default:
				return attackIndex === undefined ? [] : effectToRules(effect, attackIndex);
		}
	});

	return [
		results.filter((e): e is string => typeof e === 'string').join(' '),
		results.flatMap((e) => (typeof e === 'string' ? [] : e)),
	];
}

function toIndexName(index: number) {
	return index === 1 ? 'Secondary' : index === 2 ? 'Tertiary' : null;
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

function AttackTypeIcon({
	attackType,
	isBasic,
	...props
}: {
	attackType: EffectTypeAndRange['type'];
	isBasic?: boolean;
} & JSX.IntrinsicElements['svg']) {
	return null;
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
			return 'daily';
		case 'item':
			return '';
		case 'other':
			return '';
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

function attackType(type: EffectTypeAndRange['type']) {
	switch (type) {
		case 'melee':
			return 'Melee';
		case 'ranged':
			return 'Ranged';
		case 'close':
			return 'Close';
		case 'area':
			return 'Area';
		case 'personal':
			return 'Personal';
		case 'same-as-primary':
			return null;
		default:
			return neverEver(type);
	}
}
