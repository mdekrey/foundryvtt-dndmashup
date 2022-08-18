export type PoolRegain = { regain: number };
export type PoolReset = { reset: number };

export type PoolRechargeConfiguration = PoolRegain | PoolReset | null;

export type PoolLimits = {
	name: string;
	max: number | null;
	longRest: PoolRechargeConfiguration;
	shortRest: PoolRechargeConfiguration;
	maxBetweenRest: number | null;
};

export type PoolState = {
	name: string;
	value: number;
	usedSinceRest: number;
};

export const poolBonusTargets = ['max', 'longRest', 'shortRest', 'perRest'] as const;
export type PoolBonusTarget = typeof poolBonusTargets[number];

export type PoolBonus = {
	name: string;
	target: PoolBonusTarget;
	amount: number | string;
};

export type ResolvedPoolBonus = {
	target: PoolBonusTarget;
	amount: number;
};
