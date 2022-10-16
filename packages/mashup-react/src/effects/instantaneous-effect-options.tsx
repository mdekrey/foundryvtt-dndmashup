import { IconButton, SvgButton } from '@foundryvtt-dndmashup/components';
import { BaseDocument, useApplicationDispatcher, useIsPrerender } from '@foundryvtt-dndmashup/foundry-compat';
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
	FullFeatureBonus,
	Source,
	ConditionRuleContext,
} from '@foundryvtt-dndmashup/mashup-rules';
import { LightningBoltIcon } from '@heroicons/react/solid';
import { toComputable } from './toComputable';
import { emptyConditionRuntime } from '../bonusConditionRules';

export type InstantaneousEffectOptionsProps = {
	effect: InstantaneousEffect;
	source: Source;
	prefix?: string;
	mode: string;
	actor: ActorDocument;
	power?: PowerDocument;
	allowToolSelection: boolean;
	allowCritical: boolean;
	extraBonuses: FullFeatureBonus[];
};

export function InstantaneousEffectOptions({
	effect,
	source,
	prefix,
	mode,
	actor,
	power,
	allowToolSelection,
	allowCritical,
	extraBonuses,
}: InstantaneousEffectOptionsProps) {
	const applications = useApplicationDispatcher();
	const initialRender = useIsPrerender();
	if (initialRender) return null;
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
			console.log([
				...extraBonuses,
				...(effect.bonuses?.map(addContextToFeatureBonus({ actor, item: power, activeEffectSources: undefined })) ??
					[]),
			]);
			applications.launchApplication('damage', {
				baseDice: damageEffect.damage,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				rollType: 'damage',
				listType: 'damageTypes',
				baseDamageTypes: damageEffect.damageTypes,
				allowToolSelection,
				allowCritical,

				extraBonuses: [
					...extraBonuses,
					...(effect.bonuses
						?.map(addContextToFeatureBonus({ actor, item: power, activeEffectSources: undefined }))
						.map(addSource) ?? []),
				],
				runtimeBonusParameters: { ...emptyConditionRuntime, power },
			});
		};
	}

	function healingRoll(healingEffect: HealingEffect) {
		return () => {
			applications.launchApplication('healing', {
				baseDice: healingEffect.healing,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				rollType: 'healing',
				allowToolSelection,

				spendHealingSurge: healingEffect.spendHealingSurge,
				healingSurge: healingEffect.healingSurge,
				isTemporary: healingEffect.isTemporary,

				extraBonuses: [
					...extraBonuses,
					...(effect.bonuses
						?.map(addContextToFeatureBonus({ actor, item: power, activeEffectSources: undefined }))
						.map(addSource) ?? []),
				],
				runtimeBonusParameters: { ...emptyConditionRuntime, power },
			});
		};
	}

	function applyActiveEffect(activeEffectTemplate: ActiveEffectTemplate) {
		return () => {
			applications.launchApplication('applyEffect', {
				// TODO - better image
				effectParams: toComputable(activeEffectTemplate, actor, power?.img ?? ''),
				sources: [actor, power].filter(Boolean) as BaseDocument[],
			});
		};
	}

	function addSource(b: FeatureBonusWithContext): FullFeatureBonus {
		return { ...b, source };
	}
}

export function addContextToFeatureBonus(context: ConditionRuleContext) {
	return <T extends FeatureBonus>(b: T): T & FeatureBonusWithContext => ({
		...b,
		context,
	});
}
