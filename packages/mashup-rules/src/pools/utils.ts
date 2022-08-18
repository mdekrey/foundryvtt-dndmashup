import { PoolLimits, PoolRegain, PoolReset, PoolState, ResolvedPoolBonus } from './types';

export function isRegainPoolRecharge(target: PoolRegain | PoolReset): target is PoolRegain {
	return 'regain' in target;
}

function combineRestStat(target: PoolRegain | PoolReset | null, value: number) {
	if (target === null) return null;
	if (isRegainPoolRecharge(target)) return { regain: target.regain + value };
	return { reset: target.reset + value };
}

export function combinePoolLimits(poolLimit: PoolLimits, bonus: ResolvedPoolBonus): PoolLimits {
	const result = { ...poolLimit };
	if (bonus.target === 'max' && result.max !== null) result.max += bonus.amount;
	if (bonus.target === 'longRest') result.longRest = combineRestStat(result.longRest, bonus.amount);
	if (bonus.target === 'shortRest') result.shortRest = combineRestStat(result.shortRest, bonus.amount);
	if (bonus.target === 'perRest' && result.maxBetweenRest !== null) result.maxBetweenRest += bonus.amount;
	return result;
}

export function canUsePool(state: PoolState, limit: PoolLimits) {
	if (state.value < 1) return false;
	if (limit.maxBetweenRest !== null && state.usedSinceRest <= limit.maxBetweenRest) return false;
	return true;
}

export function applyUsePool(state: PoolState): PoolState {
	return {
		name: state.name,
		usedSinceRest: state.usedSinceRest + 1,
		value: state.value - 1,
	};
}

export function applyShortRestToPool(state: PoolState, limit: PoolLimits): PoolState {
	const newValue =
		limit.shortRest === null
			? state.value
			: isRegainPoolRecharge(limit.shortRest)
			? state.value + limit.shortRest.regain
			: limit.shortRest.reset;
	return {
		name: state.name,
		usedSinceRest: 0,
		value: limit.max === null ? newValue : Math.max(limit.max, newValue),
	};
}

export function applyLongRestToPool(state: PoolState, limit: PoolLimits): PoolState {
	const newValue =
		limit.longRest === null
			? state.value
			: isRegainPoolRecharge(limit.longRest)
			? state.value + limit.longRest.regain
			: limit.longRest.reset;
	return {
		name: state.name,
		usedSinceRest: 0,
		value: limit.max === null ? newValue : Math.max(limit.max, newValue),
	};
}
