import noop from 'lodash/fp/noop';
import { toObject } from '@foundryvtt-dndmashup/core';
import {
	abilities,
	AbilityBonus,
	byTarget,
	combinePoolLimits,
	damageTypes,
	DefenseBonus,
	defenses,
	FullDynamicListEntry,
	FullFeatureBonus,
	filterConditions,
	NumericBonusTarget,
	numericBonusTargets,
	Resistance,
	ResolvedPoolBonus,
	ruleResultIndeterminate,
	sumFinalBonuses,
	Vulnerability,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDerivedData } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../mashup-actor';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';

const setters: Record<NumericBonusTarget, (data: ActorDerivedData, value: number) => void> = {
	...toObject(
		abilities,
		(abil): AbilityBonus => `ability-${abil}`,
		(abil) => (data, value) => (data.abilities[abil].total = value)
	),
	...toObject(
		defenses,
		(def): DefenseBonus => `defense-${def}`,
		(def) => (data, value) => (data.defenses[def] = value)
	),
	...toObject(
		damageTypes,
		(dmg): Resistance => `${dmg}-resistance`,
		(dmg) => (data, value) => (data.damageTypes[dmg].resistance = value)
	),
	...toObject(
		damageTypes,
		(dmg): Vulnerability => `${dmg}-vulnerability`,
		(dmg) => (data, value) => (data.damageTypes[dmg].vulnerability = value)
	),
	maxHp: (data, value) => (data.health.hp.max = value),
	'surges-max': (data, value) => (data.health.surgesRemaining.max = value),
	'surges-value': (data, value) => (data.health.surgesValue = value),
	speed: (data, value) => (data.speed = value),
	initiative: (data, value) => (data.initiative = value),

	check: noop,
	'attack-roll': noop,
	damage: noop,
	'critical-damage': noop,
	healing: noop,
	'saving-throw': noop,
};

export function calculateDerivedData(
	this: MashupActor,
	setPrivates: (data: {
		derivedData: ActorDerivedData;
		appliedBonuses: FullFeatureBonus[];
		indeterminateBonuses: FullFeatureBonus[];
		appliedDynamicList: FullDynamicListEntry[];
		indeterminateDynamicList: FullDynamicListEntry[];
	}) => void
): ActorDerivedData {
	// TODO: this would be better as a proxy object
	const allBonuses = this.allBonuses;

	const resultData: ActorDerivedData = {
		abilities: toObject(
			abilities,
			(abil) => abil,
			() => ({ total: 0 })
		),
		health: {
			hp: { max: 0 },
			bloodied: 0,
			surgesRemaining: {
				max: 0,
			},
			surgesValue: 0,
		},
		defenses: toObject(
			defenses,
			(def) => def,
			() => 0
		),
		damageTypes: toObject(
			damageTypes,
			(dmg) => dmg,
			() => ({ resistance: 0, vulnerability: 0 })
		),
		speed: 0,
		initiative: 0,
		halfLevel: Math.floor(this.data.data.details.level / 2),
		size: this.appliedRace?.data.data.size ?? 'medium',
		pools: [],
	};
	const appliedBonuses: FullFeatureBonus[] = [];
	const indeterminateBonuses: FullFeatureBonus[] = [];
	setPrivates({
		derivedData: resultData,
		appliedBonuses: appliedBonuses,
		indeterminateBonuses: indeterminateBonuses,
		appliedDynamicList: [],
		indeterminateDynamicList: [],
	});
	const groupedByTarget = byTarget(allBonuses);
	numericBonusTargets.forEach((target) => {
		const filtered = filterConditions(groupedByTarget[target] ?? [], {}, true);
		indeterminateBonuses.push(
			...filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus)
		);
		const applicable = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		appliedBonuses.push(...applicable);
		const evaluatedBonuses = evaluateAndRoll(applicable);
		const final = sumFinalBonuses(evaluatedBonuses);
		setters[target](resultData, final);
	});

	this.subActorFunctions.prepare(resultData, this);

	resultData.health.bloodied = Math.floor(resultData.health.hp.max / 2);
	resultData.health.surgesValue = Math.floor(resultData.health.hp.max / 4);

	const filteredLists = filterConditions(this.allDynamicListResult, {}, true);

	setPrivates({
		derivedData: resultData,
		appliedBonuses: appliedBonuses,
		indeterminateBonuses: indeterminateBonuses,
		appliedDynamicList: filteredLists.filter(([, result]) => result === true).map(([bonus]) => bonus),
		indeterminateDynamicList: filteredLists
			.filter(([, result]) => result === ruleResultIndeterminate)
			.map(([bonus]) => bonus),
	});

	const pools = this.items.contents.flatMap((item) => item.allGrantedPools());
	this.items.contents
		.flatMap((item) => item.allGrantedPoolBonuses())
		.reduce((prev, next) => {
			const idx = prev.findIndex((pool) => pool.name === next.name);
			if (idx === -1) console.warn(`Unknown pool: ${next.name}`);
			else {
				const resolved: ResolvedPoolBonus = {
					...next,
					amount:
						typeof next.amount === 'number'
							? next.amount
							: new Roll(next.amount, { actor: this }).roll({ async: false })._total,
				};
				prev[idx] = combinePoolLimits(prev[idx], resolved);
			}
			return prev;
		}, pools);
	resultData.pools = pools;

	return resultData;
}
