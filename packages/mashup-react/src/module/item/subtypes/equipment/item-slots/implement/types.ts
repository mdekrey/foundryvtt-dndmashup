import { AttackEffectTrigger, ApplicableEffect } from '../../../../../../effects';

export type ImplementGroup = 'holy symbol' | 'ki focus' | 'orb' | 'rod' | 'staff' | 'tome' | 'totem' | 'wand';

export type ImplementItemSlotTemplate = {
	group: ImplementGroup;

	additionalEffects: Partial<Record<AttackEffectTrigger, ApplicableEffect>>;
};
