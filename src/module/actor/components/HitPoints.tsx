import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function HitPoints({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<h2 className="text-lg">Hit Points</h2>
			<div className="flex justify-start items-center gap-1 text-lg">
				<FormInput className="w-16">
					<FormInput.AutoNumberField document={actor} field="data.health.currentHp" className="text-center" />
					<FormInput.Label>Current</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {actor.data.data.health.maxHp}</span>
			</div>
			<label>
				Temp HP
				<div className="inline-block w-16 pl-2">
					<FormInput.AutoNumberField document={actor} field="data.health.temporaryHp" className="text-center" />
				</div>
			</label>
		</>
	);
}
