import { ApplicableEffectOptionsProps, ApplicableEffectOptions } from './applicable-effect-options';

export function ApplicableEffectSection({ effect, mode, ...effectProps }: ApplicableEffectOptionsProps) {
	return (
		<div className="flex flex-row items-center pl-2">
			<span className="flex-1">{mode}</span>

			<ApplicableEffectOptions effect={effect} mode={mode} {...effectProps} />
		</div>
	);
}
