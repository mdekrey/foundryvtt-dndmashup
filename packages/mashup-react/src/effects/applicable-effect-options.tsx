import classNames from 'classnames';
import { ActorDocument } from '../module/actor/documentType';
import { useApplicationDispatcher } from '../module/applications/context';
import { PowerDocument } from '../module/item/subtypes/power/dataSourceData';
import { ApplicableEffect, DamageEffect } from './types';
import { ReactComponent as DropIcon } from './drop.svg';
import { IconButton } from '@foundryvtt-dndmashup/components';

export function ApplicableEffectOptions({
	effect,
	prefix,
	mode,
	actor,
	relatedPower,
}: {
	effect: ApplicableEffect;
	prefix?: string;
	mode: string;
	actor: ActorDocument;
	relatedPower: PowerDocument;
}) {
	const applications = useApplicationDispatcher();
	return (
		<>
			{effect.damage && (
				<button
					className={classNames('p-1', 'focus:ring-blue-bright-600 focus:ring-1')}
					title={`${mode} Damage`}
					onClick={damageRoll(effect.damage)}
					type="button">
					<DropIcon className="w-5 h-5" />
				</button>
			)}
			{/* TODO: healing */}
			{effect.healing && <IconButton className="text-lg" iconClassName="fas fa-heart" title={`${mode} Healing`} />}
			{/* TODO: effect */}
			{false && <IconButton className="text-lg" iconClassName="fas fa-bullseye" title={`Apply ${mode} Effects`} />}
		</>
	);

	function damageRoll(damageEffect: DamageEffect) {
		return () => {
			applications.launchApplication('damage', {
				baseDice: damageEffect.damage,
				title: prefix ? `${prefix} ${mode}` : mode,
				actor,
				relatedPower,
				rollType: 'damage',
				damageTypes: damageEffect.damageTypes,
			});
		};
	}
}