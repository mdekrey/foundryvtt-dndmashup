import { AppButton, BlockHeader } from '@foundryvtt-dndmashup/components';
import {
	auraToText,
	bonusToText,
	EffectDurationType,
	getTriggeredEffectText,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActiveEffectDocumentConstructorParams, ComputableEffectDurationInfo } from '../../module';
import { ActorDocument } from '../../module/actor/documentType';

export function ApplyEffectDisplay({
	effectParams,
	targets,
	onClose,
}: {
	effectParams: ActiveEffectDocumentConstructorParams;
	targets: ActorDocument[];
	onClose: () => void;
}) {
	return (
		<>
			<BlockHeader>Immediate Effect</BlockHeader>
			<EffectPreview effectParams={effectParams} />

			<BlockHeader>Targets</BlockHeader>
			{targets.length === 0 ? (
				<p>No targets selected</p>
			) : (
				<div>
					{targets.map((target, index) => (
						<div key={target.id ?? index}>
							{/* TODO */}
							{target.name}
						</div>
					))}
				</div>
			)}

			<div className="grid grid-cols-2 gap-1">
				<AppButton onClick={onClose}>Cancel</AppButton>
				<AppButton onClick={onApplyEffect}>Apply Effect</AppButton>
			</div>
		</>
	);

	async function onApplyEffect() {
		for (const target of targets) {
			target.createActiveEffect(...effectParams);
		}
		onClose();
	}
}
function durationToText(duration: ComputableEffectDurationInfo<EffectDurationType>): string {
	switch (duration.durationType) {
		case 'endOfTurn':
			if (duration.actor) {
				return `end of ${duration.actorName}'s next turn`;
			} else {
				return `end of the target's next turn`;
			}
		case 'startOfTurn':
			if (duration.actor) {
				return `start of ${duration.actorName}'s next turn`;
			} else {
				return `start of the target's next turn`;
			}
		case 'other':
			return duration.description;
		case 'saveEnds':
			return '(save ends)';
		case 'shortRest':
			return 'until the end of the encounter';
		case 'longRest':
			return 'until the target takes a long rest';
	}
}

function EffectPreview({ effectParams }: { effectParams: ActiveEffectDocumentConstructorParams }) {
	const [{ label, icon, flags = {} }, duration] = effectParams;
	const bonuses = flags?.mashup?.bonuses ?? [];
	const triggers = flags?.mashup?.triggers ?? [];
	const auras = flags?.mashup?.auras ?? [];
	const afterEffect = flags?.mashup?.afterEffect;
	const afterFailedSave = flags?.mashup?.afterFailedSave;
	return (
		<>
			<div className="flex flex-row gap-1">
				<img src={icon} title={label} className="w-24 h-24 border-2 border-black p-px" />

				<div className="flex-grow">
					<p>
						<span className="font-bold">Duration: </span>
						{durationToText(duration)}
					</p>

					<BlockHeader className="theme-green-dark">Effects</BlockHeader>

					{bonuses.map((bonus, index) => (
						<p key={index}>{bonusToText(bonus)}</p>
					))}

					<BlockHeader className="theme-green-dark">Triggers</BlockHeader>

					{triggers.map((trigger, index) => (
						<p key={index}>{getTriggeredEffectText(trigger)}</p>
					))}

					<BlockHeader className="theme-green-dark">Auras</BlockHeader>

					{auras.map((aura, index) => (
						<p key={index}>{auraToText(aura)}</p>
					))}
				</div>
			</div>
			{afterEffect ? (
				<>
					<BlockHeader>Aftereffect</BlockHeader>
					<EffectPreview effectParams={afterEffect} />
				</>
			) : null}
			{afterFailedSave ? (
				<>
					<BlockHeader>After Failed Save</BlockHeader>
					<EffectPreview effectParams={afterFailedSave} />
				</>
			) : null}
		</>
	);
}
