import { IconButton } from '@foundryvtt-dndmashup/components';
import {
	ActorDocument,
	ApplicableEffectSection,
	AttackRoll,
	EffectTypeAndRange,
	PowerEffect,
} from '@foundryvtt-dndmashup/mashup-react';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
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
	const effectProps = { prefix: effect.name, actor, power, source: power };

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
				<ApplicableEffectSection
					effect={effect.hit}
					mode={effect.attackRoll ? 'Hit' : 'Effect'}
					{...effectProps}
					allowToolSelection={true}
					allowCritical={true}
				/>
				{effect.miss && (effect.miss.damage || effect.miss.healing) ? (
					<ApplicableEffectSection
						effect={effect.miss}
						mode="Miss"
						{...effectProps}
						allowToolSelection={true}
						allowCritical={true}
					/>
				) : null}
			</div>
		</div>
	);

	function attackRoll(attackRoll: AttackRoll) {
		return async () => rollAttack(attackRoll, effect.name || '');
	}
}
