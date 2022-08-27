import { oxfordComma } from '@foundryvtt-dndmashup/core';
import { ApplicableEffect, DamageEffect, HealingEffect } from './types';

export function toText(effect: ApplicableEffect): string {
	return [
		effect.damage && damageEffectText(effect.damage),
		effect.healing && healingEffectText(effect.healing),
		effect.text,
	]
		.filter(Boolean)
		.join(' ');
}

function damageEffectText(effect: DamageEffect) {
	return [effect.damage, oxfordComma(effect.damageTypes ?? []), 'damage.'].filter(Boolean).join(' ');
}

function healingEffectText(effect: HealingEffect) {
	const prefix = effect.spendHealingSurge
		? 'The target may spend a healing surge. If they do, the target'
		: 'The target';
	const verb = effect.isTemporary ? 'gains temporary hit points' : 'regains hit points';
	const link = 'equal to';
	const amount = [effect.healingSurge ? 'its healing surge value' : '', effect.healing].filter(Boolean).join(' plus ');

	return `${prefix} ${verb} ${link} ${amount}.`;
}
