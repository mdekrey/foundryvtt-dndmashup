import { BlockHeader, FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DamageFields } from './DamageFields';
import { HealingFields } from './HealingFields';
import { InstantaneousEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { activeEffectTemplateDefaultLens } from './lenses';
import { ActiveEffectTemplateEditorButton } from './ActiveEffectTemplateEditorButton';

const instantaneousEffectFieldLens = Lens.fromProp<InstantaneousEffect>();

const damageEffectLens = instantaneousEffectFieldLens('damage');
const effectTextLens = instantaneousEffectFieldLens('text');
const healingEffectLens = instantaneousEffectFieldLens('healing');

const activeEffectTemplateLens = instantaneousEffectFieldLens('activeEffectTemplate').combine(
	activeEffectTemplateDefaultLens
);

export function InstantaneousEffectFields({
	fallbackImage,
	prefix,
	...props
}: { prefix?: string; fallbackImage?: string | null } & Stateful<InstantaneousEffect>) {
	return (
		<>
			{prefix ? <BlockHeader>{prefix}</BlockHeader> : null}
			<div className="flex flex-row items-baseline">
				<DropIcon className="h-5 w-5 mr-1" />
				<DamageFields className="flex-grow" prefix={prefix} {...damageEffectLens.apply(props)} />
			</div>
			<div className="flex flex-row items-baseline">
				<HeartIcon className="h-5 w-5 mr-1" />
				<HealingFields className="flex-grow" prefix={prefix} {...healingEffectLens.apply(props)} />
			</div>
			<div className="flex flex-row gap-1 items-baseline">
				<LightningBoltIcon className="h-5 w-5" />
				<FormInput className="flex-grow">
					<FormInput.TextField {...effectTextLens.apply(props)} />
					<FormInput.Label>{prefix || 'Effect'}</FormInput.Label>
				</FormInput>
				<ActiveEffectTemplateEditorButton
					fallbackImage={fallbackImage}
					iconClassName="fas fa-edit"
					title={`Edit ${prefix} Effect`}
					description={props.value.text}
					activeEffectTemplate={activeEffectTemplateLens.apply(props)}
				/>
			</div>
		</>
	);
}
