import { Fragment } from 'react';
import { FormInput, ImageButton } from '@foundryvtt-dndmashup/components';
import { abilities, Ability } from '@foundryvtt-dndmashup/mashup-rules';
import { ensureSign, Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { AbilityScores } from '../types';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorDocument } from '../documentType';

const baseLens = Lens.identity<AbilityScores>();

export function Abilities({
	actor,
	abilitiesState,
}: {
	actor: ActorDocument;
	abilitiesState: Stateful<AbilityScores>;
}) {
	const applicationDispatcher = useApplicationDispatcher();
	return (
		<>
			<div className="grid grid-cols-3 gap-1 items-center justify-items-center w-32">
				<h2 className="text-lg col-span-3">Abilities</h2>
				{abilities.map((ability) => (
					<Fragment key={ability}>
						<FormInput.NumberField
							{...baseLens.toField(ability).toField('base').apply(abilitiesState)}
							className="w-8 text-lg text-center"
						/>
						<FormInput.Label className="uppercase font-bold link">{ability}</FormInput.Label>
						<div className="group relative self-stretch justify-self-stretch flex items-center justify-center">
							<span className="group-hover:invisible" title="{{a}}">
								{ensureSign(actor.derivedCache.bonuses.getValue(`ability-${ability}`))}
							</span>

							<div className="absolute inset-0 text-center invisible group-hover:visible">
								<ImageButton src="/icons/svg/d20-black.svg" onClick={() => onRoll(ability)} />
							</div>
						</div>
					</Fragment>
				))}
			</div>
		</>
	);
	function onRoll(ability: Ability) {
		// TODO: better flavor
		applicationDispatcher.launchApplication('diceRoll', {
			actor,
			allowToolSelection: false,
			baseDice: `d20`,
			rollType: 'check',
			sendToChat: true,
			title: `${ability.toUpperCase()} Check`,
			flavor: `uses ${ability.toUpperCase()}`,
			extraBonuses: [
				{
					amount: actor.derivedCache.bonuses.getValue(`ability-${ability}`),
					condition: null,
					context: { actor },
					target: 'check',
					type: 'ability',
					source: actor,
				},
				{
					condition: { rule: 'manual', parameter: { conditionText: 'half-level applies' } },
					type: 'rank',
					target: 'check',
					amount: actor.halfLevel,
					context: { actor },
					source: actor,
				},
			],
		});
	}
}
