import { ActorDocument } from '../module/actor';
import {
	ComputableEffectDurationInfo,
	EffectDurationType,
	TemplateEffectDurationInfo,
} from '../module/active-effect/types';
import { ActiveEffectTemplate } from './types';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

type Convert<T extends EffectDurationType> = (
	template: Omit<TemplateEffectDurationInfo<T>, 'durationType'>,
	caster: ActorDocument
) => Omit<ComputableEffectDurationInfo<T>, 'durationType'>;

const toComputableDuration: {
	[T in EffectDurationType]: Convert<T>;
} = {
	endOfTurn: (template, caster) => ({ rounds: template.rounds, actor: template.useTargetActor ? undefined : caster }),
	startOfTurn: (template, caster) => ({ rounds: template.rounds, actor: template.useTargetActor ? undefined : caster }),
	saveEnds: (template) => template,
	shortRest: (template) => template,
	longRest: (template) => template,
	other: (template) => template,
};

export function toComputable(
	template: ActiveEffectTemplate,
	caster: ActorDocument,
	image: string
): Parameters<ActorDocument['createActiveEffect']> {
	const duration: ComputableEffectDurationInfo = {
		durationType: template.duration.durationType,
		...toComputableDuration[template.duration.durationType](template.duration as any, caster),
	} as ComputableEffectDurationInfo;

	const bonuses = template.bonuses.map(
		({ amount, ...bonus }): FeatureBonus => ({ amount: caster.evaluateAmount(amount), ...bonus })
	);

	const afterEffect = template.afterEffect ? toComputable(template.afterEffect, caster, image) : null;
	const afterFailedSave = template.afterFailedSave ? toComputable(template.afterFailedSave, caster, image) : null;

	console.log('TODO', { afterEffect, afterFailedSave });

	return [
		{
			label: template.label,
			icon: template.image ?? image,
			flags: {
				mashup: {
					bonuses,
					// afterEffect,
					// afterFailedSave,
				},
			},
		},
		duration,
	];
}
