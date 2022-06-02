import { ArmorCategory, ArmorType } from './types';

export const allArmorCategories: Record<ArmorCategory, string> = {
	cloth: 'Cloth',
	leather: 'Leather',
	hide: 'Hide',
	chainmail: 'Chainmail',
	scale: 'Scale',
	plate: 'Plate',
};
export const allArmorTypes: Record<ArmorType, string> = {
	light: 'Light',
	heavy: 'Heavy',
};
