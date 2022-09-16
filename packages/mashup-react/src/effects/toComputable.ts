import { ActorDocument } from '../module/actor';
import { ActiveEffectDocumentConstructorParams, ComputableEffectDurationInfo } from '../module/active-effect/types';
import {
	ActiveEffectTemplate,
	Aura,
	EffectDurationType,
	FeatureBonus,
	InstantaneousEffect,
	TemplateEffectDurationInfo,
	TriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';

type Convert<T extends EffectDurationType> = (
	template: Omit<TemplateEffectDurationInfo<T>, 'durationType'>,
	caster: ActorDocument
) => Omit<ComputableEffectDurationInfo<T>, 'durationType'>;

const toComputableDuration: {
	[T in EffectDurationType]: Convert<T>;
} = {
	endOfTurn: (template, caster) => ({ actor: template.useTargetActor ? undefined : caster }),
	startOfTurn: (template, caster) => ({ actor: template.useTargetActor ? undefined : caster }),
	saveEnds: (template) => template,
	shortRest: (template) => template,
	longRest: (template) => template,
	other: (template) => template,
};

export function toComputable(
	template: ActiveEffectTemplate,
	caster: ActorDocument,
	image: string
): ActiveEffectDocumentConstructorParams {
	const duration: ComputableEffectDurationInfo = {
		durationType: template.duration.durationType,
		...toComputableDuration[template.duration.durationType](template.duration as any, caster),
	} as ComputableEffectDurationInfo;

	const bonuses = template.bonuses.map(mapBonus);
	const auras = (template.auras ?? []).map(
		({ bonuses, triggeredEffects, ...aura }): Aura => ({
			...aura,
			triggeredEffects: triggeredEffects.map(mapTriggeredEffect),
			bonuses: bonuses.map(mapBonus),
		})
	);

	const afterEffect = template.afterEffect ? toComputable(template.afterEffect, caster, image) : undefined;
	const afterFailedSave = template.afterFailedSave ? toComputable(template.afterFailedSave, caster, image) : undefined;

	return [
		{
			label: template.label,
			icon: template.image ?? image,
			flags: {
				core: {
					statusId: template.coreStatusId || undefined,
				},
				mashup: {
					bonuses,
					triggers: template.triggeredEffects?.map(mapTriggeredEffect) ?? [],
					auras,
					afterEffect,
					afterFailedSave,
				},
			},
		},
		duration,
		template.useStandard ?? false,
	];

	function mapBonus({ amount, ...bonus }: FeatureBonus): FeatureBonus {
		return { amount: caster.simplifyAmount(amount), ...bonus };
	}
	function mapTriggeredEffect({ effect, ...trigger }: TriggeredEffect): TriggeredEffect {
		return { effect: mapEffect(effect), ...trigger };
	}
	function mapEffect({ damage, healing, ...effect }: InstantaneousEffect): InstantaneousEffect {
		return {
			damage: damage && { ...damage, damage: caster.simplifyAmount(damage.damage) },
			healing: healing && { ...healing, healing: caster.simplifyAmount(healing.healing) },
			...effect,
		};
	}
}
