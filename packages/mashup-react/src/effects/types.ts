import { DamageType } from '../types/types';

export type ApplicableEffect = {
	text: string;
	healing: HealingEffect | null;
	damage: DamageEffect | null;
	// TODO: effect template to drag/drop to apply ongoing effects
};

export type DamageEffect = {
	damage: string;
	damageTypes: DamageType[];
};

export type HealingEffect = {
	healing: string;
	healingSurge: boolean;
	isTemporary: boolean;
};
