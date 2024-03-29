import { isEquipment, WeaponItemSlotTemplate } from '@foundryvtt-dndmashup/mashup-react';
import { conditionsRegistry, ruleResultIndeterminate } from '@foundryvtt-dndmashup/mashup-rules';

type SwordmageEquipmentConditionParameter = { conditionText: string };

declare global {
	interface ConditionRules {
		swordmageEquipment: SwordmageEquipmentConditionParameter;
	}
}

conditionsRegistry.swordmageEquipment = {
	ruleText: () =>
		'when you are wielding a blade in one hand and have your other hand free (not carrying a shield, an off-hand weapon, a two-handed weapon, or anything else).',
	ruleEditor: () => null,
	rule: (input) => {
		if (!input.actor) return ruleResultIndeterminate;
		const equipment = input.actor.items.contents.filter(isEquipment);
		if (equipment.some((eq) => eq.system.equipped.includes('off-hand'))) return false;
		if (
			!equipment.some((eq) => {
				if (eq.system.itemSlot !== 'weapon') return false;
				if (!eq.system.equipped.includes('primary-hand')) return false;
				const group = (eq.system.equipmentProperties as WeaponItemSlotTemplate).group;
				if (group !== 'heavy-blade' && group !== 'light-blade') return false;
				return true;
			})
		) {
			return false;
		}
		return true;
	},
};
