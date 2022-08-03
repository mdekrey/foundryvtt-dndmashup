import { IconButton, ImageButton } from '@foundryvtt-dndmashup/components';
import {
	ActorDocument,
	ApplicableEffect,
	AttackRoll,
	DamageEffect,
	EffectTypeAndRange,
	PowerEffect,
	useApplicationDispatcher,
} from '@foundryvtt-dndmashup/mashup-react';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import classNames from 'classnames';
import { ReactComponent as DropIcon } from './drop.svg';

type PowerEffectTemplateProps = {
	canCreateEffect: (typeAndRange: EffectTypeAndRange) => boolean;
	createEffect: (typeAndRange: EffectTypeAndRange) => void;
};

export function PowerChat({
	item,
	actor,
	...effectProps
}: { item: PowerDocument; actor: ActorDocument } & PowerEffectTemplateProps) {
	return (
		<div className="flex flex-col items-center">
			<div className="w-full border-4 border-white">
				<PowerPreview item={item} simple />
			</div>
			{actor.isOwner ? <PowerOptions power={item} actor={actor} {...effectProps} /> : null}
		</div>
	);
}

function PowerOptions({
	power,
	actor,
	...effectProps
}: { power: PowerDocument; actor: ActorDocument } & PowerEffectTemplateProps) {
	return (
		<>
			{power.data.data.effects.filter(hasEffectInfo).map((effect, index) => (
				<PowerEffectOptions key={index} effect={effect} {...effectProps} actor={actor} power={power} />
			))}
		</>
	);
}

function hasEffectInfo(effect: PowerEffect): boolean {
	return Boolean(
		effect.attackRoll ||
			effect.hit.damage ||
			effect.hit.healing ||
			effect.miss?.damage ||
			effect.miss?.healing ||
			effect.typeAndRange.type === 'close' ||
			effect.typeAndRange.type === 'area' ||
			effect.typeAndRange.type === 'within'
	);
}
function PowerEffectOptions({
	actor,
	power: relatedPower,
	effect,
	canCreateEffect: canCreate,
	createEffect,
}: { effect: PowerEffect; power: PowerDocument; actor: ActorDocument } & PowerEffectTemplateProps) {
	const applications = useApplicationDispatcher();

	const effectProps = { prefix: effect.name, actor, relatedPower };

	return (
		<div className={classNames('grid grid-cols-1 w-full')}>
			<div className="flex flex-row items-center bg-gradient-to-r from-transparent to-white text-black h-7">
				<span className="flex-1 font-bold pl-1">{effect.name}</span>

				{canCreate(effect.typeAndRange) && (
					<IconButton
						className="text-lg"
						iconClassName="fas fa-ruler-combined"
						title="Place Template"
						onClick={() => createEffect(effect.typeAndRange)}
					/>
				)}
				{effect.attackRoll && (
					<IconButton
						className="text-lg"
						iconClassName="fas fa-dice-d20"
						title="Roll Attack"
						onClick={attackRoll(effect.attackRoll)}
					/>
				)}
			</div>
			<div className="text-gray-800">
				{applicableEffectSection(effect.hit, effect.attackRoll ? 'Hit' : 'Effect')}
				{effect.miss && (effect.miss.damage || effect.miss.healing)
					? applicableEffectSection(effect.miss, 'Miss')
					: null}
			</div>
		</div>
	);

	function applicableEffectSection(apEffect: ApplicableEffect, mode: string) {
		return (
			<div className="flex flex-row items-center pl-2">
				<span className="flex-1">{mode}</span>

				<ApplicableEffectOptions effect={apEffect} mode={mode} {...effectProps} />
			</div>
		);
	}

	function attackRoll(attackRoll: AttackRoll) {
		return async () => {
			const [, result] = applications.launchApplication('diceRoll', {
				baseDice: `1d20 + ${attackRoll.attack}`,
				title: effect.name ? `${effect.name} Attack` : `Attack`,
				actor,
				relatedPower: relatedPower,
				rollType: 'attack-roll',
			});
			try {
				console.log(await result);
			} catch (ex) {
				// result could throw - just cancel the die roll
			}
		};
	}
}

function ApplicableEffectOptions({
	effect,
	prefix,
	mode,
	actor,
	relatedPower,
}: {
	effect: ApplicableEffect;
	prefix?: string;
	mode: string;
	actor: ActorDocument;
	relatedPower: PowerDocument;
}) {
	const applications = useApplicationDispatcher();
	return (
		<>
			{effect.damage && (
				<button
					className={classNames('p-1', 'focus:ring-blue-bright-600 focus:ring-1')}
					title={`${mode} Damage`}
					onClick={damageRoll(effect.damage)}
					type="button">
					<DropIcon className="w-5 h-5" />
				</button>
			)}
			{/* TODO: healing */}
			{effect.healing && <IconButton className="text-lg" iconClassName="fas fa-heart" title={`${mode} Healing`} />}
			{/* TODO: effect */}
			{false && <IconButton className="text-lg" iconClassName="fas fa-bullseye" title={`Apply ${mode} Effects`} />}
		</>
	);

	function damageRoll(damageEffect: DamageEffect) {
		return async () => {
			const [, result] = applications.launchApplication('diceRoll', {
				baseDice: damageEffect.damage,
				title: prefix ? `${prefix} ${mode} Damage` : `${mode} Damage`,
				actor,
				relatedPower,
				rollType: 'damage',
			});
			try {
				console.log(await result);
			} catch (ex) {
				// result could throw - just cancel the die roll
			}
		};
	}
}
