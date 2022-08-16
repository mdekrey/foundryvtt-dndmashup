import { Fragment } from 'react';
import { FormInput, ImageButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SkillEntry } from '../types';

const baseLens = Lens.identity<SkillEntry[]>();

export function Skills({ skillsState }: { skillsState: Stateful<SkillEntry[]> }) {
	return (
		<div className="grid grid-cols-3 gap-1 mt-2 items-center justify-items-center w-32">
			<h2 className="text-lg col-span-3">Skills</h2>
			{skillsState.value.map((skill, index) => (
				<Fragment key={skill.name}>
					<div className="group">
						<ImageButton className="ml-1 invisible group-hover:visible" src="/icons/svg/d20-black.svg" />
					</div>
					<img src={skill.img} alt={skill.name} title={skill.name} className="w-8 h-8 inline-block" />
					<FormInput.NumberField
						{...baseLens.toField(index).toField('ranks').apply(skillsState)}
						className="w-8 text-lg text-center"
					/>
				</Fragment>
			))}
		</div>
	);
}
