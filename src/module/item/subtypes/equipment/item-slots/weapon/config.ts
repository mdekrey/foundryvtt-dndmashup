import { WeaponItemSlotTemplate, WeaponCategory, WeaponGroup, WeaponProperty } from './types';

export const weaponCategories: Record<WeaponCategory, string> = {
	simple: 'Simple',
	military: 'Military',
	superior: 'Superior',
};
export const weaponHands: Record<WeaponItemSlotTemplate['hands'], string> = {
	1: 'One-handed',
	2: 'Two-handed',
};
export const weaponGroups: Record<WeaponGroup, string> = {
	axe: 'Axe',
	bow: 'Bow',
	crossbow: 'Crossbow',
	flail: 'Flail',
	hammer: 'Hammer',
	'heavy-blade': 'Heavy Blade',
	'light-blade': 'Light Blade',
	mace: 'Mace',
	pick: 'Pick',
	polearm: 'Polearm',
	sling: 'Sling',
	spear: 'Spear',
	staff: 'Staff',
	unarmed: 'Unarmed',
};
export const weaponProperties: Record<WeaponProperty, string> = {
	'heavy-thrown': 'Heavy Thrown',
	'high-crit': 'High Crit',
	'light-thrown': 'Light Thrown',
	load: 'Load',
	'off-hand': 'Off Hand',
	reach: 'Reach',
	small: 'Small',
	versatile: 'Versatile',
};
