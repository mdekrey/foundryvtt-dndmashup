import { InstantaneousEffectOptionsProps, InstantaneousEffectOptions } from './instantaneous-effect-options';

export function InstantaneousEffectSection({ effect, mode, ...effectProps }: InstantaneousEffectOptionsProps) {
	return (
		<div className="flex flex-row items-center pl-2">
			<span className="flex-1">{mode}</span>

			<InstantaneousEffectOptions effect={effect} mode={mode} {...effectProps} />
		</div>
	);
}
