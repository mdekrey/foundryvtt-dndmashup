import { ensureSign, oxfordComma } from '@foundryvtt-dndmashup/core';
import { InstantaneousEffect, DamageEffect, HealingEffect } from '@foundryvtt-dndmashup/mashup-rules';

export function toText(effect: InstantaneousEffect, { bonus = false }: { bonus?: boolean } = {}): string {
	return [
		effect.damage && damageEffectText(effect.damage, bonus),
		effect.healing && healingEffectText(effect.healing, bonus),
		effect.text,
	]
		.filter(Boolean)
		.join(' ');
}

function damageEffectText(effect: DamageEffect, bonus: boolean) {
	return [bonus ? ensureSign(effect.damage) : effect.damage, oxfordComma(effect.damageTypes ?? []), 'damage.']
		.filter(Boolean)
		.join(' ');
}

function healingEffectText(effect: HealingEffect, bonus: boolean) {
	if (bonus) {
		const prefix = effect.spendHealingSurge ? 'When target spends a healing surge, the target' : 'The target';
		const verb = effect.isTemporary ? 'gains more temporary hit points' : 'regains additional hit points';
		const link = 'equal to';
		const amount = [effect.healingSurge ? 'its healing surge value' : '', effect.healing]
			.filter(Boolean)
			.join(' plus ');

		return `${prefix} ${verb} ${link} ${ensureSign(amount)}.`;
	} else {
		const prefix = effect.spendHealingSurge
			? 'The target may spend a healing surge. If they do, the target'
			: 'The target';
		const verb = effect.isTemporary ? 'gains temporary hit points' : 'regains hit points';
		const link = 'equal to';
		const amount = [effect.healingSurge ? 'its healing surge value' : '', effect.healing]
			.filter(Boolean)
			.join(' plus ');

		return `${prefix} ${verb} ${link} ${amount}.`;
	}
}
