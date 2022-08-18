import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { PoolLimits, PoolState } from '@foundryvtt-dndmashup/mashup-rules';
import { ResourceLayout } from './ResourceLayout';
import { FormInput } from '@foundryvtt-dndmashup/components';

const baseLens = Lens.identity<PoolState[]>().to(
	(v) => v,
	(mutator) => (draft) => mutator(draft)
);
const lensToPoolState = (poolName: string) => {
	return baseLens
		.combine(
			Lens.from<PoolState[], PoolState | undefined>(
				(pools) => pools.find((p) => p.name === poolName),
				(mutator) => (draft) => {
					const index = draft.findIndex((p) => p.name === poolName);
					const result = mutator(undefined);
					if (result !== undefined) {
						if (index === -1) {
							draft.push(result);
						} else {
							draft[index] = result;
						}
					}
					return draft;
				}
			)
		)
		.default({ name: poolName, usedSinceRest: 0, value: 0 });
};

export function Pools({ poolLimits, poolsState }: { poolLimits: PoolLimits[]; poolsState: Stateful<PoolState[]> }) {
	return poolLimits.length > 0 ? (
		<div className="grid grid-cols-3 gap-1 mt-2 items-center justify-items-center">
			{poolLimits.map((pool, index) => (
				<PoolDetails key={pool.name} pool={pool} state={lensToPoolState(pool.name).apply(poolsState)} />
			))}
		</div>
	) : null;
}

const currentLens = Lens.fromProp<PoolState>()('value');
const usedSinceRestLens = Lens.fromProp<PoolState>()('usedSinceRest');

function PoolDetails({ pool, state }: { pool: PoolLimits; state: Stateful<PoolState> }) {
	return (
		<ResourceLayout
			title={pool.name}
			body={
				<>
					<FormInput className="w-16">
						<FormInput.NumberField {...currentLens.apply(state)} className="text-center" />
						<FormInput.Label>Current</FormInput.Label>
					</FormInput>
					{typeof pool.max === 'number' ? <span className="text-lg pb-4">/ {pool.max}</span> : null}
				</>
			}
			footer={
				typeof pool.maxBetweenRest === 'number' ? (
					<div className="flex justify-start flex-grow items-baseline gap-1 text-sm">
						<span>Since rest: </span>
						<FormInput className="w-12">
							<FormInput.NumberField {...usedSinceRestLens.apply(state)} className="text-center" />
							<FormInput.Label>Used</FormInput.Label>
						</FormInput>
						<span className="pb-4">/ {pool.maxBetweenRest}</span>
					</div>
				) : null
			}
		/>
	);
}
