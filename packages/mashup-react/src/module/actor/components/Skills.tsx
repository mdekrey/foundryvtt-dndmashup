import { Fragment } from 'react';
import { FormInput, ImageButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SkillEntry } from '../types';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorDocument } from '../documentType';
import { abilities, FeatureBonusWithContext } from '@foundryvtt-dndmashup/mashup-rules';

const baseLens = Lens.identity<SkillEntry[]>().to(
	(v) => v,
	(mutator) => (draft) => mutator(draft).filter((v) => v.ranks >= 0)
);

export function Skills({ actor, skillsState }: { actor: ActorDocument; skillsState: Stateful<SkillEntry[]> }) {
	const applicationDispatcher = useApplicationDispatcher();
	return skillsState.value.length > 0 ? (
		<div className="grid grid-cols-3 gap-1 mt-2 items-center justify-items-center w-32">
			<h2 className="text-lg col-span-3">Skills</h2>
			{skillsState.value.map((skill, index) => (
				<Fragment key={skill.name}>
					<img src={skill.img} alt={skill.name} title={skill.name} className="w-8 h-8 inline-block" />
					<FormInput.NumberField
						{...baseLens.toField(index).toField('ranks').apply(skillsState)}
						className="w-8 text-lg text-center"
					/>
					<div>
						<ImageButton src="/icons/svg/d20-black.svg" onClick={() => onRoll(skill)} />
					</div>
				</Fragment>
			))}
		</div>
	) : null;

	function onRoll(skill: SkillEntry) {
		// TODO: better flavor
		applicationDispatcher.launchApplication('diceRoll', {
			actor,
			allowToolSelection: false,
			baseDice: `d20`,
			rollType: 'check',
			sendToChat: true,
			source: actor,
			title: `${skill.name} Check`,
			flavor: `uses the skill ${skill.name}`,

			extraBonuses: [
				{
					amount: skill.ranks,
					condition: null,
					context: { actor },
					target: 'check',
					type: 'rank',
				},
				...abilities.map(
					(ability): FeatureBonusWithContext => ({
						condition: { rule: 'manual', parameter: { conditionText: `${ability.toUpperCase()} applies` } },
						type: 'ability',
						target: 'check',
						amount: `+${ability.toUpperCase()}`,
						context: { actor },
					})
				),
			],
		});
	}
}
