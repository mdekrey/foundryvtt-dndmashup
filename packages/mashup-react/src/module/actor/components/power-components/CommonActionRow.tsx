import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { useChatMessageDispatcher } from '../../../chat';
import { CommonAction } from '../../actions';
import { ActorDocument } from '../../documentType';
import { PowerFirstRow } from './PowerFirstRow';

export function CommonActionRow({ actor, power }: { actor: ActorDocument; power: CommonAction }) {
	const isReady = power.isReady(actor);
	const setReady = power.setReady;
	const chatDispatch = useChatMessageDispatcher();
	const appDispatch = useApplicationDispatcher();

	return (
		<PowerFirstRow
			name={power.name}
			displayName={power.name}
			img={power.img}
			hint={power.hint}
			usage={power.usage}
			isReady={isReady}
			onToggleReady={setReady && (() => setReady(actor, !isReady))}
			onRoll={() => power.use(actor, { chatDispatch, appDispatch })}
		/>
	);
}
