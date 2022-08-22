import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

export type ActiveEffectDocumentConstructorData = {
	icon?: string;
	label: string;
	flags?: {
		core?: {
			statusId?: string;
		};
		mashup: {
			bonuses?: FeatureBonus[];
		};
	};
};
