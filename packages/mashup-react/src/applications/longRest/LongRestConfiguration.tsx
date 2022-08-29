import { AppButton, BlockHeader } from '@foundryvtt-dndmashup/components';
import { ActorDocument } from '../../module/actor/documentType';
import { useChatMessageDispatcher } from '../../module/chat';

export function LongRestConfiguration({ actor, onClose }: { actor: ActorDocument; onClose: () => void }) {
	const chatDispatch = useChatMessageDispatcher();
	return (
		<>
			<BlockHeader className="theme-gray-dark">Long Rest</BlockHeader>
			<div className="grid grid-cols-2 gap-1">
				<AppButton onClick={onClose}>Cancel</AppButton>
				<AppButton onClick={onUseLongRest}>Take Long Rest</AppButton>
			</div>
		</>
	);

	async function onUseLongRest() {
		if (!(await actor.applyLongRest())) return;
		chatDispatch.sendChatMessage('plain-text', actor, `takes a long rest.`);
		onClose();
	}
}
