import { ActorDocument } from '../../documentType';
import { Table } from '@foundryvtt-dndmashup/components';
import { useRef } from 'react';
import { useChatMessageDispatcher } from '../../../chat';
import { PowerPreview } from '../../../item/subtypes/power/components/PowerPreview';
import { PowerDocument } from '../../../item/subtypes/power/dataSourceData';
import { PowerFirstRow } from './PowerFirstRow';

export function PowerRow({ actor, power }: { actor: ActorDocument; power: PowerDocument }) {
	const detailRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useChatMessageDispatcher();

	return (
		<Table.Body>
			<PowerFirstRow
				name={power.name ?? ''}
				usage={power.data.data.usage}
				img={power.img ?? ''}
				hint=""
				isReady={actor.isReady(power)}
				onClickName={toggle}
				onEdit={edit}
				onRemove={remove}
				onRoll={shareToChat}
			/>
			<tr>
				<td></td>
				<td colSpan={2}>
					<div ref={detailRef} className="overflow-hidden max-h-0 transition-all duration-300">
						<div className="max-w-md mx-auto border-4 border-white">
							<PowerPreview item={power} />
						</div>
					</div>
				</td>
				<td></td>
			</tr>
		</Table.Body>
	);

	function edit() {
		power.showEditDialog();
	}
	function remove() {
		power.delete();
	}
	async function shareToChat() {
		dispatch.sendChatMessage('power', actor, { item: power });
	}
	function toggle() {
		if (!detailRef.current) return;
		if (detailRef.current.style.maxHeight) detailRef.current.style.maxHeight = '';
		else detailRef.current.style.maxHeight = `${detailRef.current.scrollHeight}px`;
	}
}
