import { IconButton, SvgButton } from '@foundryvtt-dndmashup/components';
import { SimpleDocument, useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorDocument } from '../module/actor/documentType';
import { PowerDocument } from '../module/item/subtypes/power/dataSourceData';
import { ActiveEffectTemplate, ApplicableEffect, DamageEffect, HealingEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { LightningBoltIcon } from '@heroicons/react/solid';
import { toComputable } from './toComputable';

export type ApplicableEffectOptionsProps = {
	effect: ApplicableEffect;
	prefix?: string;
	mode: string;
	actor: ActorDocument;
	source: SimpleDocument;
	power?: PowerDocument;
	allowToolSelection: boolean;
	allowCritical: boolean;
};

export function ApplicableEffectOptions({
	effect,
	prefix,
	mode,
	actor,
	source,
	power,
	allowToolSelection,
	allowCritical,
}: ApplicableEffectOptionsProps) {
	const applications = useApplicationDispatcher();
	return (
		<>
			{effect.damage && (
				<SvgButton icon={DropIcon} title={`${mode} Damage`} onClick={damageRoll(effect.damage)} type="button" />
			)}
			{effect.healing && (
				<IconButton
					className="text-lg"
					iconClassName="fas fa-heart"
					onClick={healingRoll(effect.healing)}
					title={`${mode} Healing`}
				/>
			)}
			{effect.activeEffectTemplate && (
				<SvgButton
					icon={LightningBoltIcon}
					title={`Apply ${mode} Effects`}
					onClick={applyActiveEffect(effect.activeEffectTemplate)}
				/>
			)}
		</>
	);

	function damageRoll(damageEffect: DamageEffect) {
		return () => {
			applications.launchApplication('damage', {
				baseDice: damageEffect.damage,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				source,
				power,
				rollType: 'damage',
				listType: 'damageTypes',
				baseDamageTypes: damageEffect.damageTypes,
				allowToolSelection,
				allowCritical,
			});
		};
	}

	function healingRoll(healingEffect: HealingEffect) {
		return () => {
			applications.launchApplication('healing', {
				baseDice: healingEffect.healing,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				source,
				power,
				rollType: 'healing',
				allowToolSelection,

				spendHealingSurge: healingEffect.spendHealingSurge,
				healingSurge: healingEffect.healingSurge,
				isTemporary: healingEffect.isTemporary,
			});
		};
	}

	function applyActiveEffect(activeEffectTemplate: ActiveEffectTemplate) {
		return () => {
			applications.launchApplication('applyEffect', {
				// TODO - better image
				effectParams: toComputable(activeEffectTemplate, actor, power?.img ?? ''),
			});
		};
	}
}
