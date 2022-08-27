import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { PoolState, SourcedPoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { ResourceLayout } from './ResourceLayout';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { SourceButton } from './SourceButton';
import { noop } from 'lodash/fp';

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

export function Pools({
	magicItemUses,
	magicItemUsesPerDay,
	poolLimits,
	poolsState,
}: {
	magicItemUsesPerDay: number;
	magicItemUses: Stateful<number>;
	poolLimits: SourcedPoolLimits[];
	poolsState: Stateful<PoolState[]>;
}) {
	return poolLimits.length > 0 ? (
		<div className="grid grid-cols-3 gap-1 mt-2 items-start justify-items-center">
			<PoolDetails
				pool={{
					max: magicItemUsesPerDay,
					name: 'Magic Item Daily Power Uses',
					longRest: null,
					shortRest: null,
					maxBetweenRest: null,
					source: [],
				}}
				current={{
					value: magicItemUsesPerDay - magicItemUses.value,
					onChangeValue: (mutator) => magicItemUses.onChangeValue((v) => magicItemUsesPerDay - (mutator(v) ?? v)),
				}}
				usedSinceRest={{ onChangeValue: noop, value: 0 }}
			/>
			{poolLimits.map((pool, index) => (
				<PoolDetails
					key={pool.name}
					pool={pool}
					current={lensToPoolState(pool.name).toField('value').apply(poolsState)}
					usedSinceRest={lensToPoolState(pool.name).toField('usedSinceRest').apply(poolsState)}
				/>
			))}
		</div>
	) : null;
}

function PoolDetails({
	pool,
	current,
	usedSinceRest,
}: {
	pool: SourcedPoolLimits;
	current: Stateful<number>;
	usedSinceRest: Stateful<number>;
}) {
	return (
		<ResourceLayout
			title={pool.name}
			body={
				<>
					<FormInput className="w-16">
						<FormInput.NumberField {...current} className="text-center" />
						<FormInput.Label>Current</FormInput.Label>
					</FormInput>
					{typeof pool.max === 'number' ? <span className="text-lg pb-4">/ {pool.max}</span> : null}
				</>
			}
			footer={
				<div className="flex flex-col gap-1">
					{typeof pool.maxBetweenRest === 'number' ? (
						<div className="self-center flex justify-start flex-grow items-baseline gap-1 text-sm">
							<span>Since rest: </span>
							<FormInput className="w-12">
								<FormInput.NumberField {...usedSinceRest} className="text-center" />
								<FormInput.Label>Used</FormInput.Label>
							</FormInput>
							<span className="pb-4">/ {pool.maxBetweenRest}</span>
						</div>
					) : null}
					{pool.source.map((source, index) => (
						<SourceButton key={source.id ?? index} source={source} />
					))}
				</div>
			}
		/>
	);
}
