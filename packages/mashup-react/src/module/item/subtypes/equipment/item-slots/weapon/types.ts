import { AttackEffectTrigger, ApplicableEffect } from '../../../../../../effects';

export type WeaponCategory = 'simple' | 'military' | 'superior';
export type WeaponGroup =
	| 'axe'
	| 'bow'
	| 'crossbow'
	| 'flail'
	| 'hammer'
	| 'heavy-blade'
	| 'light-blade'
	| 'mace'
	| 'pick'
	| 'polearm'
	| 'sling'
	| 'spear'
	| 'staff'
	| 'unarmed';
export type WeaponProperty =
	| 'heavy-thrown'
	| 'high-crit'
	| 'light-thrown'
	| 'load'
	| 'off-hand'
	| 'reach'
	| 'small'
	| 'versatile';

export type WeaponItemSlotTemplate = {
	damage: string;
	proficiencyBonus: number;
	range: string;
	group: WeaponGroup;
	properties: WeaponProperty[];
	category: WeaponCategory;
	hands: 1 | 2;

	additionalEffects: Partial<Record<AttackEffectTrigger, ApplicableEffect>>;
};
