import { BlockHeader, FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DamageFields } from './DamageFields';
import { HealingFields } from './HealingFields';
import { ApplicableEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';

const applicableEffectFieldLens = Lens.fromProp<ApplicableEffect>();

const damageEffectLens = applicableEffectFieldLens('damage');
const effectTextLens = applicableEffectFieldLens('text');
const healingEffectLens = applicableEffectFieldLens('healing');

export function ApplicableEffectFields({ prefix, ...props }: { prefix?: string } & Stateful<ApplicableEffect>) {
	return (
		<>
			{prefix ? <BlockHeader>{prefix}</BlockHeader> : null}
			<div className="flex flex-row">
				<DropIcon className="h-5 w-5 mr-1" />
				<DamageFields className="flex-grow" prefix={prefix} {...damageEffectLens.apply(props)} />
			</div>
			<div className="flex flex-row">
				<HeartIcon className="h-5 w-5 mr-1" />
				<HealingFields className="flex-grow" prefix={prefix} {...healingEffectLens.apply(props)} />
			</div>
			<div className="flex flex-row">
				<LightningBoltIcon className="h-5 w-5 mr-1" />
				<FormInput className="flex-grow">
					<FormInput.TextField {...effectTextLens.apply(props)} />
					<FormInput.Label>{prefix}</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
