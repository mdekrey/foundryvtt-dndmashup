import { ConditionRule, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

function manual(text: string): { condition: ConditionRule<'manual'> } {
	return { condition: { rule: 'manual', parameter: { conditionText: text } } };
}

const base = { condition: null } as const;
export const standardBonuses: FeatureBonus[] = [
	{ ...base, target: 'ability-str', amount: '@actor.data.data.abilities.str.base', type: 'base' },
	{ ...base, target: 'ability-con', amount: '@actor.data.data.abilities.con.base', type: 'base' },
	{ ...base, target: 'ability-dex', amount: '@actor.data.data.abilities.dex.base', type: 'base' },
	{ ...base, target: 'ability-int', amount: '@actor.data.data.abilities.int.base', type: 'base' },
	{ ...base, target: 'ability-wis', amount: '@actor.data.data.abilities.wis.base', type: 'base' },
	{ ...base, target: 'ability-cha', amount: '@actor.data.data.abilities.cha.base', type: 'base' },
	{ ...base, target: 'maxHp', amount: `10 + 2 * @actor.derivedData.abilities.con.total`, type: 'base' },
	{ ...base, target: 'surges-max', amount: '@actor.derivedData.abilities.con.total', type: 'ability' },
	{ ...base, target: 'defense-ac', amount: 10 },
	{ ...base, target: 'defense-ac', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: 10 },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.str.total', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.con.total', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: 10 },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.int.total', type: 'ability' },
	{ ...base, target: 'defense-will', amount: 10 },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.wis.total', type: 'ability' },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.cha.total', type: 'ability' },
	{ ...base, target: 'initiative', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },

	{ ...manual('you have combat advantage against the target'), target: 'attack-roll', amount: 2 },
	{ ...manual('you are charging'), target: 'attack-roll', amount: 1 },
	{ ...manual('the target has concealment from you'), target: 'attack-roll', amount: -2 },
	{ ...manual('the target has total concealment from you'), target: 'attack-roll', amount: -5 },
	{ ...manual('the target has cover from you'), target: 'attack-roll', amount: -2 },
	{ ...manual('the target has superior cover from you'), target: 'attack-roll', amount: -5 },
	{ ...manual('the target is long range from you'), target: 'attack-roll', amount: -2 },
	{ ...manual('you are prone'), target: 'attack-roll', amount: -2 }, // TODO: automate
	{ ...manual('you are restrained'), target: 'attack-roll', amount: -2 }, // TODO: automate
	{ ...manual('you are running'), target: 'attack-roll', amount: -5 },
	{ ...manual('you are squeezing'), target: 'attack-roll', amount: -5 },
];
