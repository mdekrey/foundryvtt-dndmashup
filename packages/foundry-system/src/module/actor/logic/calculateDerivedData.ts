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
	PoolBonus,
	SourcedPoolBonus,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDerivedData } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../mashup-actor';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { uniq } from 'lodash/fp';
import { pcStandardBonuses, monsterStandardBonuses } from './standardBonuses';
import { isActorType } from '../templates/isActorType';

const standardPoolBonus: PoolBonus[] = [];

type NonAggregateNumericBonus = Exclude<NumericBonusTarget, 'all-resistance' | `${string}-vulnerability`>;
function isNotAggregate(numericBonus: NumericBonusTarget): numericBonus is NonAggregateNumericBonus {
	return numericBonus !== 'all-resistance' && !numericBonus.endsWith('-vulnerability');
}
const setters: Record<NonAggregateNumericBonus, (data: ActorDerivedData, value: number) => void> = {
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
	maxHp: (data, value) => (data.health.hp.max = value),
	'surges-max': (data, value) => (data.health.surgesRemaining.max = value),
	'surges-value': (data, value) => (data.health.surgesValue = value),
	speed: (data, value) => (data.speed = value),
	initiative: (data, value) => (data.initiative = value),
	'magic-item-uses': (data, value) => (data.magicItemUse.usesPerDay = value),

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
	const allBonuses = [
		...(this.type === 'pc' ? pcStandardBonuses : monsterStandardBonuses).map((bonus) => ({
			...bonus,
			source: this,
			context: { actor: this },
		})),
		...this.allBonuses,
	];

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
		size: isActorType(this, 'pc')
			? this.appliedRace?.data.data.size ?? 'medium'
			: isActorType(this, 'monster')
			? this.data._source.data.size
			: 'medium',
		poolLimits: [],
		milestones: Math.floor((this.data.data.encountersSinceLongRest ?? 0) / 2),
		magicItemUse: {
			usesPerDay: 0,
		},
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

	numericBonusTargets.filter(isNotAggregate).forEach((target) => {
		const filtered = filterConditions(groupedByTarget[target] ?? [], {}, true);
		const final = totalFiltered(filtered);
		setters[target](resultData, final);
	});
	damageTypes.forEach((damageType) => {
		const finalResistances = totalFiltered(
			filterConditions([...groupedByTarget[`${damageType}-resistance`], ...groupedByTarget[`all-resistance`]], {}, true)
		);
		const finalVulnerabilities = totalFiltered(
			filterConditions(
				[...groupedByTarget[`${damageType}-vulnerability`], ...groupedByTarget[`all-vulnerability`]],
				{},
				true
			)
		);

		const final = finalResistances - finalVulnerabilities;
		setters[`${damageType}-resistance`](resultData, final);
	});

	function totalFiltered(filtered: (readonly [FullFeatureBonus, boolean | typeof ruleResultIndeterminate])[]) {
		indeterminateBonuses.push(
			...filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus)
		);
		const applicable = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		appliedBonuses.push(...applicable);
		const evaluatedBonuses = evaluateAndRoll(applicable);
		return sumFinalBonuses(evaluatedBonuses);
	}

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
		.flatMap<PoolBonus | SourcedPoolBonus>((item) => [...standardPoolBonus, ...item.allGrantedPoolBonuses()])
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
				prev[idx] = {
					...combinePoolLimits(prev[idx], resolved),
					source: 'source' in next ? uniq([...prev[idx].source, next.source]) : prev[idx].source,
				};
			}
			return prev;
		}, pools);
	resultData.poolLimits = pools;

	if (isActorType(this, 'monster')) {
		resultData.size = this.data._source.data.size;
	}

	return resultData;
}
