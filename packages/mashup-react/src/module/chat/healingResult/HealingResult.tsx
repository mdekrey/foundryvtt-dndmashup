import { RollJson, RollInfo } from '@foundryvtt-dndmashup/foundry-compat';
import { PowerDocument } from '../../item';
import { ChatButton } from '@foundryvtt-dndmashup/components';

export const HealingResult = ({
	roll,
	power,
	spendHealingSurge,
	isTemporary,
	onApply,
}: {
	roll: RollJson;
	power?: PowerDocument;

	spendHealingSurge: boolean;
	isTemporary: boolean;

	onApply?: () => void;
}) => {
	return (
		<>
			<div className="dice-roll block">
				<RollInfo roll={roll} />
			</div>
			<ChatButton onClick={onApply} className="mt-1 w-full">
				{spendHealingSurge ? 'Spend Healing Surge & ' : ''} Apply {isTemporary ? 'Temp HP' : 'Healing'}
			</ChatButton>
		</>
	);
};
