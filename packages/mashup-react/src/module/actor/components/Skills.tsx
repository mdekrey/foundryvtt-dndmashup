import { Fragment } from 'react';
import { AppButton, FormInput, ImageButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SkillEntry } from '../types';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorDocument } from '../documentType';
import { abilities, FullFeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { emptyConditionContext, emptyConditionRuntime } from '../../../bonusConditionRules';

const baseLens = Lens.identity<SkillEntry[]>().to(
	(v) => v,
	(mutator) => (draft) => mutator(draft).filter((v) => v.ranks >= 0)
);

export function Skills({ actor, skillsState }: { actor: ActorDocument; skillsState: Stateful<SkillEntry[]> }) {
	const applicationDispatcher = useApplicationDispatcher();

	return (
		<div className="grid grid-cols-3 gap-1 mt-2 items-center justify-items-center w-32">
			<h2 className="text-lg col-span-3">Skills</h2>
			{skillsState.value.map((skill, index) => (
				<Fragment key={skill.name}>
					<FormInput.TextField
						{...baseLens.toField(index).toField('name').apply(skillsState)}
						className="col-span-3 text-lg"
					/>
					<FormInput.ImageEditor
						className="w-8 h-8"
						{...baseLens.toField(index).toField('img').apply(skillsState)}
						title={skill.name}
					/>
					<FormInput.NumberField
						{...baseLens.toField(index).toField('ranks').apply(skillsState)}
						className="w-8 text-lg text-center"
					/>
					<div>
						<ImageButton src="/icons/svg/d20-black.svg" onClick={() => onRoll(skill)} />
					</div>
					{index < skillsState.value.length - 1 ? <hr className="col-span-3 border-black w-full border-t-1" /> : null}
				</Fragment>
			))}
			<AppButton className="col-span-3" onClick={onAddSkill}>
				Add Skill
			</AppButton>
		</div>
	);

	function onRoll(skill: SkillEntry) {
		// TODO: better flavor
		applicationDispatcher.launchApplication('diceRoll', {
			actor,
			allowToolSelection: false,
			baseDice: `d20`,
			rollType: 'check',
			sendToChat: true,
			title: `${skill.name} Check`,
			flavor: `uses the skill ${skill.name}`,
			runtimeBonusParameters: { ...emptyConditionRuntime },

			extraBonuses: [
				{
					amount: skill.ranks,
					condition: null,
					context: { ...emptyConditionContext, actor },
					target: 'check',
					type: 'rank',
					source: actor,
				},
				...abilities.map(
					(ability): FullFeatureBonus => ({
						condition: { rule: 'manual', parameter: { conditionText: `${ability.toUpperCase()} applies` } },
						type: 'ability',
						target: 'check',
						amount: `+${ability.toUpperCase()}`,
						context: { ...emptyConditionContext, actor },
						source: actor,
					})
				),
			],
		});
	}

	function onAddSkill() {
		baseLens.apply(skillsState).onChangeValue((skills) => {
			skills.push({
				name: 'Unknown',
				img: 'icons/skills/trades/academics-investigation-puzzles.webp',
				ranks: 0,
			});
		});
	}
}
