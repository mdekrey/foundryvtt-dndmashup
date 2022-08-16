import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { HealingEffect } from './types';
import classNames from 'classnames';

const baseLens = Lens.identity<HealingEffect | null>().default(
	{ healing: '', healingSurge: false, spendHealingSurge: false, isTemporary: false },
	(effect) => effect.healing === '' && effect.healingSurge === false && effect.isTemporary === false
);

export const healingDiceLens = baseLens.toField('healing');
export const healingSurgeLens = baseLens.toField('healingSurge');
export const spendHealingSurgeLens = baseLens.toField('spendHealingSurge');
export const isTemporaryLens = baseLens.toField('isTemporary');

export function HealingFields({
	className,
	prefix,
	...props
}: { prefix?: string; className?: string } & Stateful<HealingEffect | null>) {
	const healingState = healingDiceLens.apply(props);
	return (
		<div className={classNames('grid grid-cols-12 gap-x-1', className)}>
			<FormInput className="col-span-3 self-end">
				<FormInput.TextField {...healingState} />
				<FormInput.Label>{prefix} Healing Dice</FormInput.Label>
			</FormInput>
			<div
				className={classNames('col-span-9 flex flex-col', {
					'opacity-50 focus-within:opacity-100': !healingState.value,
				})}>
				<FormInput.Inline>
					<FormInput.Checkbox {...isTemporaryLens.apply(props)} className="self-center" />
					<span>is Temporary?</span>
				</FormInput.Inline>
				<FormInput.Inline>
					<FormInput.Checkbox {...spendHealingSurgeLens.apply(props)} className="self-center" />
					<span>spend healing surge</span>
				</FormInput.Inline>
				<FormInput.Inline>
					<FormInput.Checkbox {...healingSurgeLens.apply(props)} className="self-center" />
					<span>add healing surge value</span>
				</FormInput.Inline>
			</div>
		</div>
	);
}
