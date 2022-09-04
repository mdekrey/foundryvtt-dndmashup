import { useState } from 'react';
import { BlockHeader, FormInput, IconButton, Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DamageFields } from './DamageFields';
import { HealingFields } from './HealingFields';
import { InstantaneousEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { ActiveEffectTemplateEditor } from './ActiveEffectTemplateEditor';
import { activeEffectTemplateDefaultLens } from './lenses';

const instantaneousEffectFieldLens = Lens.fromProp<InstantaneousEffect>();

const damageEffectLens = instantaneousEffectFieldLens('damage');
const effectTextLens = instantaneousEffectFieldLens('text');
const healingEffectLens = instantaneousEffectFieldLens('healing');

const activeEffectTemplateLens = instantaneousEffectFieldLens('activeEffectTemplate').combine(
	activeEffectTemplateDefaultLens
);

export function InstantaneousEffectFields({ prefix, ...props }: { prefix?: string } & Stateful<InstantaneousEffect>) {
	const [editingEffect, setEditingEffect] = useState(false);
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
					<FormInput.Label>{prefix}</FormInput.Label>
				</FormInput>
				<IconButton iconClassName="fas fa-edit" title="Edit Effect" onClick={() => setEditingEffect(true)} />
			</div>
			<Modal
				title={`Edit ${prefix} Instantaneous Effect`}
				isOpen={editingEffect}
				onClose={() => setEditingEffect(false)}
				options={{ resizable: true, width: 400 }}>
				<div className="grid grid-cols-1 min-h-64">
					<p>{props.value.text}</p>
					<ActiveEffectTemplateEditor {...activeEffectTemplateLens.apply(props)} />
				</div>
			</Modal>
		</>
	);
}
