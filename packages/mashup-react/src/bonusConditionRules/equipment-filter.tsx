import { FormInput } from '@foundryvtt-dndmashup/components';
import { keywordsAsStringLens, Lens, oxfordComma } from '@foundryvtt-dndmashup/core';
import { ConditionRuleContext, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../module/actor/documentType';
import { getItemSlotInfo, isEquipment, ItemDocument, ItemSlot, itemSlotOptions, PowerDocument } from '../module/item';

declare global {
	interface ConditionGrantingContext {
		actor: ActorDocument;
		item: ItemDocument;
	}
	interface ConditionRulesAllRuntimeParameters {
		power: PowerDocument;
	}
}

type EquipmentFilterParameter = {
	wearing: boolean;
	keywords: string[];
	itemSlot: ItemSlot;
};

export function equipmentFilter({ actor }: ConditionRuleContext, parameter: EquipmentFilterParameter) {
	if (!actor) return false;
	const isWearing = actor.items.contents
		.filter(isEquipment)
		.filter((eq) => eq.system.equipped.length > 0 && eq.system.itemSlot === parameter.itemSlot)
		.some((eq) => {
			const actualKeywords = getItemSlotInfo(parameter.itemSlot).keywords(eq.system.equipmentProperties as never);
			return parameter.keywords.every((keyword) => actualKeywords.includes(keyword));
		});

	return parameter.wearing ? isWearing : !isWearing;
}

declare global {
	interface ConditionRules {
		equipmentFilter: EquipmentFilterParameter;
	}
}

const ruleText = (param?: EquipmentFilterParameter) =>
	param
		? `when you are ${param.wearing ? 'wearing' : 'not wearing'} ${oxfordComma(param.keywords ?? [])} ${
				getItemSlotInfo(param.itemSlot ?? '')?.display
		  }`.trim()
		: `when you are wearing (or not) some type of equipment`;

const baseLens = Lens.identity<EquipmentFilterParameter | undefined>().default({
	itemSlot: 'armor',
	keywords: [],
	wearing: false,
});
const wearingLens = baseLens.toField('wearing');
const keywordsLens = baseLens.toField('keywords').default([]).combine(keywordsAsStringLens);
const itemSlotLens = baseLens.toField('itemSlot');

conditionsRegistry.equipmentFilter = {
	ruleText,
	ruleEditor: (state) => (
		<>
			<FormInput.Inline className="text-lg whitespace-nowrap items-baseline">
				<FormInput.Checkbox {...wearingLens.apply(state)} />
				<span>when wearing</span>
			</FormInput.Inline>
			<FormInput className="text-lg">
				<FormInput.TextField {...keywordsLens.apply(state)} />
				<FormInput.Label>Keywords</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg">
				<FormInput.Select className="text-center" options={itemSlotOptions} {...itemSlotLens.apply(state)} />
				<FormInput.Label className="text-sm">Item Slot</FormInput.Label>
			</FormInput>
			<p>{ruleText(state.value)}</p>
		</>
	),
	rule: equipmentFilter,
};
