import { IconButton, SvgButton } from '@foundryvtt-dndmashup/components';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorDocument } from '../module/actor/documentType';
import { PowerDocument } from '../module/item/subtypes/power/dataSourceData';
import {
	ActiveEffectTemplate,
	InstantaneousEffect,
	DamageEffect,
	HealingEffect,
	DropIcon,
	FeatureBonusWithContext,
	FeatureBonus,
} from '@foundryvtt-dndmashup/mashup-rules';
import { LightningBoltIcon } from '@heroicons/react/solid';
import { toComputable } from './toComputable';

export type InstantaneousEffectOptionsProps = {
	effect: InstantaneousEffect;
	prefix?: string;
	mode: string;
	actor: ActorDocument;
	power?: PowerDocument;
	allowToolSelection: boolean;
	allowCritical: boolean;
	extraBonuses: FeatureBonusWithContext[];
};

export function InstantaneousEffectOptions({
	effect,
	prefix,
	mode,
	actor,
	power,
	allowToolSelection,
	allowCritical,
	extraBonuses,
}: InstantaneousEffectOptionsProps) {
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
				power,
				rollType: 'damage',
				listType: 'damageTypes',
				baseDamageTypes: damageEffect.damageTypes,
				allowToolSelection,
				allowCritical,

				extraBonuses: [...extraBonuses, ...(effect.bonuses?.map(addContextToFeatureBonus(actor, power)) ?? [])],
			});
		};
	}

	function healingRoll(healingEffect: HealingEffect) {
		return () => {
			applications.launchApplication('healing', {
				baseDice: healingEffect.healing,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				power,
				rollType: 'healing',
				allowToolSelection,

				spendHealingSurge: healingEffect.spendHealingSurge,
				healingSurge: healingEffect.healingSurge,
				isTemporary: healingEffect.isTemporary,

				extraBonuses: [...extraBonuses, ...(effect.bonuses?.map(addContextToFeatureBonus(actor, power)) ?? [])],
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

export function addContextToFeatureBonus(actor: ActorDocument | undefined, power: PowerDocument | undefined) {
	return (b: FeatureBonus): FeatureBonusWithContext => ({ ...b, context: { actor, item: power } });
}
