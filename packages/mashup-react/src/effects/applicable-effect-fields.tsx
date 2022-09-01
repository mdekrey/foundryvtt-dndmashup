import { useState } from 'react';
import { BlockHeader, FormInput, IconButton, Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DamageFields } from './DamageFields';
import { HealingFields } from './HealingFields';
import { ApplicableEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { ActiveEffectTemplateEditor } from './ActiveEffectTemplateEditor';
import { activeEffectTemplateDefaultLens } from './lenses';

const applicableEffectFieldLens = Lens.fromProp<ApplicableEffect>();

const damageEffectLens = applicableEffectFieldLens('damage');
const effectTextLens = applicableEffectFieldLens('text');
const healingEffectLens = applicableEffectFieldLens('healing');

const activeEffectTemplateLens = applicableEffectFieldLens('activeEffectTemplate').combine(
	activeEffectTemplateDefaultLens
);

export function ApplicableEffectFields({ prefix, ...props }: { prefix?: string } & Stateful<ApplicableEffect>) {
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
				title={`Edit ${prefix} Applicable Effect`}
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
