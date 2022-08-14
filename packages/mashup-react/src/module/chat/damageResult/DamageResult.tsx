import { RollJson, RollInfo } from '@foundryvtt-dndmashup/foundry-compat';
import { PowerDocument } from '../../item';
import { DamageType } from '@foundryvtt-dndmashup/mashup-rules';
import { ChatButton } from '@foundryvtt-dndmashup/components';

export const DamageResult = ({
	roll,
	power,
	damageTypes,
	onApplyHalfDamage,
	onApplyDamage,
}: {
	roll: RollJson;
	power?: PowerDocument;
	damageTypes: DamageType[];

	onApplyHalfDamage?: () => void;
	onApplyDamage?: () => void;
}) => {
	console.log({ roll });
	return (
		<>
			<div className="dice-roll block">
				{damageTypes.length ? (
					<p>
						<span className="font-bold">Damage Type: </span>
						{damageTypes.join(', ')}
					</p>
				) : null}
				<RollInfo roll={roll} />
			</div>
			<div className="grid grid-cols-2 gap-1 mt-1">
				<ChatButton onClick={onApplyHalfDamage}>Apply Half Damage</ChatButton>
				<ChatButton onClick={onApplyDamage}>Apply Damage</ChatButton>
			</div>
		</>
	);
};
