import { Fragment } from 'react';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { abilities, Ability } from '../../../types/types';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { AbilityScores } from '../types';

const baseLens = Lens.identity<AbilityScores>();

export function Abilities({
	abilitiesState,
	getFinalScore,
}: {
	abilitiesState: Stateful<AbilityScores>;
	getFinalScore(ability: Ability): number;
}) {
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
						<span title="{{a}}">{ensureSign(getFinalScore(ability))}</span>
					</Fragment>
				))}
			</div>
		</>
	);
}

function ensureSign(mod: number) {
	const result = mod.toFixed(0);
	return result.startsWith('-') ? result : `+${result}`;
}
