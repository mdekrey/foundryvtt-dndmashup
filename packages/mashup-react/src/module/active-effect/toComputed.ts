import { ActorDocument } from '../actor';
import { ComputableEffectDurationInfo, EffectDurationType, TemplateEffectDurationInfo } from './types';

type Convert<T extends EffectDurationType> = (
	template: Omit<TemplateEffectDurationInfo<T>, 'durationType'>,
	caster: ActorDocument
) => Omit<ComputableEffectDurationInfo<T>, 'durationType'>;

export const toComputed: {
	[T in EffectDurationType]: Convert<T>;
} = {
	endOfTurn: (template, caster) => ({ rounds: template.rounds, actor: template.useTargetActor ? undefined : caster }),
	startOfTurn: (template, caster) => ({ rounds: template.rounds, actor: template.useTargetActor ? undefined : caster }),
	saveEnds: (template) => template,
	shortRest: (template) => template,
	longRest: (template) => template,
	other: (template) => template,
};
