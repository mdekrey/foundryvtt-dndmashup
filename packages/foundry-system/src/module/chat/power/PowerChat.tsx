import { IconButton } from '@foundryvtt-dndmashup/components';
import {
	ActorDocument,
	InstantaneousEffectSection,
	AttackRoll,
	EffectTypeAndRange,
	PowerEffect,
	InstantaneousEffectOptions,
	PowerPreview,
	PowerDocument,
	effectTypeAndRangeText,
} from '@foundryvtt-dndmashup/mashup-react';
import { InstantaneousEffect } from '@foundryvtt-dndmashup/mashup-rules';
import classNames from 'classnames';

type PowerEffectTemplateProps = {
	canCreateEffect: (typeAndRange: EffectTypeAndRange) => boolean;
	createEffect: (typeAndRange: EffectTypeAndRange) => void;
};

export function PowerChat({
	...props
}: {
	item: PowerDocument;
	actor: ActorDocument;
	rollAttack: (attackRoll: AttackRoll, title: string) => void;
} & PowerEffectTemplateProps) {
	return (
		<div className="flex flex-col items-center">
			<PowerChatContents {...props} />
		</div>
	);
}

function PowerChatContents({
	item,
	actor,
	...effectProps
}: {
	item: PowerDocument;
	actor: ActorDocument;
	rollAttack: (attackRoll: AttackRoll, title: string) => void;
} & PowerEffectTemplateProps) {
	const subPowers = item.allGrantedPowers();
	return (
		<>
			<div className="w-full border-4 border-white">
				<PowerPreview item={item} simple />
			</div>
			{actor.isOwner ? <PowerOptions power={item} actor={actor} {...effectProps} /> : null}
			<div className="ml-4">
				{subPowers.map((subPower, index) => (
					<PowerChatContents actor={actor} item={subPower} {...effectProps} key={subPower.id ?? index} />
				))}
			</div>
		</>
	);
}

function PowerOptions({
	power,
	actor,
	...effectProps
}: {
	power: PowerDocument;
	actor: ActorDocument;
	rollAttack: (attackRoll: AttackRoll, title: string) => void;
} & PowerEffectTemplateProps) {
	return (
		<>
			{power.data.data.effects
				.filter((e) => hasEffectInfo(e, effectProps.canCreateEffect))
				.map((effect, index) => (
					<PowerEffectOptions key={index} effect={effect} {...effectProps} actor={actor} power={power} />
				))}
		</>
	);
}

function hasEffectInfo(effect: PowerEffect, canCreateEffect: (typeAndRange: EffectTypeAndRange) => boolean): boolean {
	return Boolean(
		effect.attackRoll || showSection(effect.hit) || showSection(effect.miss) || canCreateEffect(effect.typeAndRange)
	);
}

function showSection(effect: InstantaneousEffect | null): effect is InstantaneousEffect {
	return !!(effect && (effect.damage || effect.healing || effect.activeEffectTemplate));
}

function PowerEffectOptions({
	actor,
	power,
	effect,
	canCreateEffect: canCreate,
	createEffect,
	rollAttack,
}: {
	effect: PowerEffect;
	power: PowerDocument;
	actor: ActorDocument;
	rollAttack: (attackRoll: AttackRoll, title: string) => void;
} & PowerEffectTemplateProps) {
	const prefix = `${power.name} ${effect.name}`.trim();
	const effectProps = { prefix: prefix, actor, power, source: power };
	const missSection = showSection(effect.miss) ? (
		<InstantaneousEffectSection
			effect={effect.miss}
			mode="Miss"
			{...effectProps}
			allowToolSelection={true}
			allowCritical={true}
		/>
	) : null;
	const placeTemplateButton = canCreate(effect.typeAndRange) && (
		<IconButton
			className="text-lg"
			iconClassName="fas fa-ruler-combined"
			title={`Place Template for ${effectTypeAndRangeText(effect.typeAndRange)}`}
			onClick={() => createEffect(effect.typeAndRange)}
		/>
	);
	const hasHitOrMiss = !!effect.attackRoll;
	const attackRollButton = effect.attackRoll && (
		<IconButton
			className="text-lg"
			iconClassName="fas fa-dice-d20"
			title="Roll Attack"
			onClick={attackRoll(effect.attackRoll)}
		/>
	);
	const hasRow1 = missSection || canCreate(effect.typeAndRange) || attackRollButton;

	return (
		<div className={classNames('grid grid-cols-1 w-full')}>
			{hasRow1 && (
				<div className="flex flex-row items-center bg-gradient-to-r from-transparent to-white text-black h-7">
					<span className="flex-1 font-bold pl-1">{effect.name || power.name}</span>

					{placeTemplateButton}
					{attackRollButton}
					{!hasHitOrMiss ? (
						<InstantaneousEffectOptions
							effect={effect.hit}
							mode={`${prefix} Effect`.trim()}
							{...effectProps}
							allowToolSelection={true}
							allowCritical={true}
						/>
					) : null}
				</div>
			)}
			{hasHitOrMiss && (
				<div className="text-gray-800 pl-4">
					<InstantaneousEffectSection
						effect={effect.hit}
						mode={`Hit${hasRow1 ? '' : ` ${effect.name}`}`}
						{...effectProps}
						allowToolSelection={true}
						allowCritical={true}
					/>
					{missSection}
				</div>
			)}
		</div>
	);

	function attackRoll(attackRoll: AttackRoll) {
		return async () => rollAttack(attackRoll, effect.name || '');
	}
}
