import { isEquipment, WeaponItemSlotTemplate } from '@foundryvtt-dndmashup/mashup-react';
import { conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';

type SwordmageEquipmentConditionParameter = { conditionText: string };

declare global {
	interface ConditionRules {
		swordmageEquipment: SwordmageEquipmentConditionParameter;
	}
}

conditionsRegistry.swordmageEquipment = {
	ruleText: () =>
		'you are wielding a blade in one hand and have your other hand free (not carrying a shield, an off-hand weapon, a two-handed weapon, or anything else).',
	ruleEditor: () => null,
	rule: (input) => {
		const equipment = input.actor.items.contents.filter(isEquipment);
		if (equipment.some((eq) => eq.data.data.equipped.includes('off-hand'))) return false;
		if (
			!equipment.some((eq) => {
				if (eq.data.data.itemSlot !== 'weapon') return false;
				if (!eq.data.data.equipped.includes('primary-hand')) return false;
				const group = (eq.data.data.equipmentProperties as WeaponItemSlotTemplate).group;
				if (group !== 'heavy-blade' && group !== 'light-blade') return false;
				return true;
			})
		) {
			return false;
		}
		return true;
	},
};
