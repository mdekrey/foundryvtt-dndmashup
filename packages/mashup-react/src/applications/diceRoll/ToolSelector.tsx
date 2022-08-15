import { DocumentSelector } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from '../../module/item';

export function ToolSelector({
	possibleTools,
	tool,
	onChangeTool,
}: {
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	tool: EquipmentDocument<'weapon' | 'implement'> | null;
	onChangeTool: React.Dispatch<React.SetStateAction<EquipmentDocument<'weapon' | 'implement'> | null>>;
}) {
	return possibleTools ? (
		<div className="text-lg">
			<DocumentSelector documents={possibleTools} value={tool} onChange={onChangeTool} allowNull={true} />
		</div>
	) : null;
}
