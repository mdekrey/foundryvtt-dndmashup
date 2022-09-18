import { useState } from 'react';
import { BlockHeader, FormInput, Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DamageFields } from './DamageFields';
import { HealingFields } from './HealingFields';
import { InstantaneousEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { HeartIcon, LightningBoltIcon, PlusIcon } from '@heroicons/react/solid';
import { activeEffectTemplateDefaultLens } from './lenses';
import { ActiveEffectTemplateEditorButton } from './ActiveEffectTemplateEditorButton';
import { BonusesEditor, bonusToText } from '../bonuses';

const instantaneousEffectFieldLens = Lens.fromProp<InstantaneousEffect>();

const damageEffectLens = instantaneousEffectFieldLens('damage');
const effectTextLens = instantaneousEffectFieldLens('text');
const healingEffectLens = instantaneousEffectFieldLens('healing');
const bonusesLens = instantaneousEffectFieldLens('bonuses').default([]);

const activeEffectTemplateLens = instantaneousEffectFieldLens('activeEffectTemplate').combine(
	activeEffectTemplateDefaultLens
);

export function InstantaneousEffectFields({
	fallbackImage,
	prefix,
	...props
}: { prefix?: string; fallbackImage?: string | null } & Stateful<InstantaneousEffect>) {
	const [bonusesOpen, setBonusesOpen] = useState(false);
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
			<button
				type="button"
				className="flex flex-row gap-1 items-baseline text-left"
				onClick={() => setBonusesOpen((b) => !b)}>
				<PlusIcon className="h-5 w-5" />
				<p className="flex-grow">
					{props.value.bonuses?.length ? props.value.bonuses?.map(bonusToText).join(' ') : 'No bonuses'}
				</p>
			</button>
			<Modal title={`Bonuses during ${prefix}`} isOpen={bonusesOpen} onClose={() => setBonusesOpen(false)}>
				<BonusesEditor bonuses={bonusesLens.apply(props)} />
			</Modal>
		</>
	);
}
