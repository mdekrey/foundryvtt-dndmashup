import {
	FullDynamicListEntry,
	FullFeatureBonus,
	filterConditions,
	NumericBonusTarget,
	ruleResultIndeterminate,
	sumFinalBonuses,
	SourcedPoolBonus,
	SourcedPoolLimits,
	DynamicListTarget,
	FullTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import {
	ActorDerivedData,
	DerivedCache,
	DerivedCacheType,
	emptyConditionContext,
	emptyConditionRuntime,
} from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../mashup-actor';
import { evaluateBonusByType } from '../../bonuses/evaluateAndRoll';
import { pcStandardBonuses, monsterStandardBonuses } from './standardBonuses';
import {
	getAllBonuses,
	getAllLists,
	getBaseGrantedPools,
	getBonuses,
	getList,
	getPoolBonuses,
	getPoolResult,
	getTriggeredEffects,
} from './getBonuses';
import { isGame } from '../../../core/foundry';

type DerivedCacheEntry<TResult, TModifier> = { value: TResult; applied: TModifier[]; indeterminate: TModifier[] };

type DerivedBonusCache = DerivedCache['bonuses'];
type DerivedPoolsCache = DerivedCache['pools'];
type DerivedListsCache = DerivedCache['lists'];
type DerivedTriggersCache = DerivedCache['triggeredEffects'];

abstract class AggregateCache<TTarget extends string | symbol, TResult, TModifier>
	implements DerivedCacheType<TTarget, TResult, TModifier>
{
	constructor(protected readonly actor: MashupActor) {}

	private readonly cache: Partial<Record<TTarget, DerivedCacheEntry<TResult, TModifier>>> = {};

	getValue(target: TTarget): TResult {
		return this.getCache(target).value;
	}

	getApplied(target: TTarget) {
		return this.getCache(target).applied;
	}

	getIndeterminate(target: TTarget) {
		return this.getCache(target).indeterminate;
	}

	abstract getAll(): TModifier[];

	private getCache(target: TTarget): DerivedCacheEntry<TResult, TModifier> {
		let cached = this.cache[target];
		if (cached) return cached;
		if (!isGame(game) || !game.ready) {
			return this.getFailedCacheRecord();
		}
		try {
			cached = this.buildCache(target);
			this.cache[target] = cached;
			return cached;
		} catch (ex) {
			console.warn(`While resolving ${target} for ${this.actor.name}`, ex, (game as any).ready);
			return this.getFailedCacheRecord();
		}
	}

	protected abstract buildCache(target: TTarget): DerivedCacheEntry<TResult, TModifier>;
	protected abstract getFailedCacheRecord(): DerivedCacheEntry<TResult, TModifier>;
}

class BonusCache extends AggregateCache<NumericBonusTarget, number, FullFeatureBonus> implements DerivedBonusCache {
	private get standardBonuses() {
		return this.actor.type === 'pc' ? pcStandardBonuses : monsterStandardBonuses;
	}

	override getAll() {
		return getAllBonuses(this.actor);
	}

	protected override buildCache(target: NumericBonusTarget): DerivedCacheEntry<number, FullFeatureBonus> {
		const bonuses: FullFeatureBonus[] = [
			...this.standardBonuses
				.filter((f) => f.target === target)
				.map((bonus) => ({
					...bonus,
					source: this.actor,
					context: { ...emptyConditionContext, actor: this.actor },
				})),
			...getBonuses(this.actor, target),
		];
		const filtered = filterConditions(bonuses, emptyConditionRuntime, true);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);

		const evaluatedBonuses = evaluateBonusByType(applied);
		const value = sumFinalBonuses(evaluatedBonuses);
		return {
			value,
			applied,
			indeterminate,
		};
	}
	protected override getFailedCacheRecord(): DerivedCacheEntry<number, FullFeatureBonus> {
		return { value: 0, applied: [], indeterminate: [] };
	}
}

class ListsCache
	extends AggregateCache<DynamicListTarget, string[], FullDynamicListEntry>
	implements DerivedListsCache
{
	override getAll() {
		return getAllLists(this.actor);
	}

	protected override buildCache(target: DynamicListTarget) {
		const bonuses: FullDynamicListEntry[] = getList(this.actor, target);
		const filtered = filterConditions(bonuses, emptyConditionRuntime, true);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);

		return {
			value: applied.map((entry) => entry.entry),
			applied,
			indeterminate,
		};
	}
	protected override getFailedCacheRecord(): DerivedCacheEntry<string[], FullDynamicListEntry> {
		return { value: [], applied: [], indeterminate: [] };
	}
}

const emptyPool: SourcedPoolLimits = {
	name: '',
	max: 0,
	longRest: null,
	shortRest: null,
	maxBetweenRest: null,
	source: [],
};

class PoolsCache extends AggregateCache<string, SourcedPoolLimits, SourcedPoolBonus> implements DerivedPoolsCache {
	getPools(): string[] {
		return this.baseGrantedPools.map((p) => p.name);
	}

	override getAll() {
		return this.actor.items.contents.flatMap<SourcedPoolBonus>((item) => item.allGrantedPoolBonuses());
	}

	protected override buildCache(target: string) {
		const pool = getBaseGrantedPools(this.actor).find((p) => p.name === target) ?? { ...emptyPool, name: target };
		const bonuses: SourcedPoolBonus[] = getPoolBonuses(this.actor, target);

		return {
			value: getPoolResult(this.actor, pool, bonuses),
			applied: bonuses,
			indeterminate: [],
		};
	}
	protected override getFailedCacheRecord(): DerivedCacheEntry<SourcedPoolLimits, SourcedPoolBonus> {
		return {
			value: {
				name: '',
				max: 0,
				longRest: null,
				shortRest: null,
				maxBetweenRest: null,
				source: [],
			},
			applied: [],
			indeterminate: [],
		};
	}

	private _baseGrantedPools: SourcedPoolLimits[] | null = null;
	get baseGrantedPools(): SourcedPoolLimits[] {
		if (this._baseGrantedPools === null) this._baseGrantedPools = getBaseGrantedPools(this.actor);
		return this._baseGrantedPools;
	}
}

class TriggersCache implements DerivedTriggersCache {
	constructor(readonly actor: MashupActor) {}

	getAll(): FullTriggeredEffect[] {
		return getTriggeredEffects(this.actor);
	}
}

export class DerivedTotals implements DerivedCache {
	constructor(private actor: MashupActor) {}

	readonly bonuses: DerivedCache['bonuses'] = new BonusCache(this.actor);
	readonly lists = new ListsCache(this.actor);
	readonly pools = new PoolsCache(this.actor);
	readonly triggeredEffects = new TriggersCache(this.actor);
}

export function calculateDerivedData(this: MashupActor): ActorDerivedData {
	return {
		health: {
			hp: { max: this.derivedCache.bonuses.getValue('maxHp') },
			surgesRemaining: { max: this.derivedCache.bonuses.getValue('surges-max') },
		},
		initiative: this.derivedCache.bonuses.getValue('initiative'),
	};
}
