import { ChatButton } from '@foundryvtt-dndmashup/components';
import {
	ActorDocument,
	AttackRoll,
	DamageEffect,
	EffectTypeAndRange,
	PowerEffect,
	useApplicationDispatcher,
} from '@foundryvtt-dndmashup/mashup-react';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import classNames from 'classnames';

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
			<button onClick={onDemo}>Demo</button>
		</>
	);

	async function onDemo() {
		const roll = Roll.fromTerms([
			new Die({ number: 1, faces: 20 }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 2, options: { flavor: 'ability bonus' } }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 4, options: { flavor: 'power bonus' } }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 2, options: { flavor: 'bonus' } }),
		]);
		console.log(roll.formula);
		await roll.evaluate();
		const json = roll.toJSON();
		console.log(roll, json);
		await roll.toMessage();
	}
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
	power,
	effect,
	canCreateEffect: canCreate,
	createEffect,
}: { effect: PowerEffect; power: PowerDocument; actor: ActorDocument } & PowerEffectTemplateProps) {
	const applications = useApplicationDispatcher();
	return (
		<div
			className={classNames('grid grid-cols-1 w-full gap-1 mt-1', {
				'pt-1': effect.name,
			})}>
			{effect.name && <p className="bg-theme text-white px-2 font-bold text-center py-1">{effect.name}</p>}

			{canCreate(effect.typeAndRange) ? (
				<ChatButton className="mx-2" onClick={() => createEffect(effect.typeAndRange)}>
					Place Template
				</ChatButton>
			) : null}
			{effect.attackRoll && (
				<ChatButton className="mx-2" onClick={attackRoll(effect.attackRoll)}>
					Roll Attack
				</ChatButton>
			)}
			{effect.hit.damage && (
				<ChatButton className="mx-2" onClick={damageRoll(effect.hit.damage, 'Hit')}>
					Hit Damage
				</ChatButton>
			)}
			{effect.hit.healing && <ChatButton className="mx-2">Hit Healing</ChatButton>}
			{effect.miss?.damage && (
				<ChatButton className="mx-2" onClick={damageRoll(effect.miss.damage, 'Miss')}>
					Miss Damage
				</ChatButton>
			)}
			{effect.miss?.healing && <ChatButton className="mx-2">Miss Healing</ChatButton>}
		</div>
	);

	function attackRoll(attackRoll: AttackRoll) {
		return async () => {
			const [, result] = applications.launchApplication('diceRoll', {
				baseDice: `1d20 + ${attackRoll.attack}`,
				title: effect.name ? `${effect.name} Attack` : `Attack`,
				actor,
				relatedPower: power,
				rollType: 'attack-roll',
			});
			try {
				console.log(await result);
			} catch (ex) {
				// result could throw - just cancel the die roll
			}
		};
	}

	function damageRoll(damage: DamageEffect, mode: 'Hit' | 'Miss') {
		return async () => {
			const [, result] = applications.launchApplication('diceRoll', {
				baseDice: damage.damage,
				title: effect.name ? `${effect.name} ${mode} Damage` : `${mode} Damage`,
				actor,
				relatedPower: power,
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
