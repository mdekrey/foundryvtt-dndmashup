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

export type PoolBonus = {
	name: string;
	target: 'max' | 'longRest' | 'shortRest' | 'perRest';
	amount: number | string;
};

export type ResolvedPoolBonus = {
	target: 'max' | 'longRest' | 'shortRest' | 'perRest';
	amount: number;
};
