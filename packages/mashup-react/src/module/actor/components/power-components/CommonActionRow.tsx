import { ActorDocument } from '../../documentType';
import { CommonAction } from './CommonAction';
import { PowerFirstRow } from './PowerFirstRow';

export function CommonActionRow({ actor, power }: { actor: ActorDocument; power: CommonAction }) {
	const isReady = power.isReady(actor);
	const setReady = power.setReady;
	return (
		<PowerFirstRow
			name={power.name}
			img={power.img}
			hint={power.hint}
			usage={power.usage}
			isReady={isReady}
			onToggleReady={setReady && (() => setReady(actor, !isReady))}
		/>
	);
}
