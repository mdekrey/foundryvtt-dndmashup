import { useSheetContext } from 'src/components/sheet/framework';
import { SpecificActor } from '../mashup-actor';
import { MashupActorSheet } from '../mashup-actor-sheet';
import { PcSheet } from './pcSheet';

export function ActorSheetJsxDemo() {
	const sheet = useSheetContext<MashupActorSheet>();

	const actor = sheet.actor as SpecificActor;

	return actor.data.type === 'pc' ? <PcSheet actor={actor as SpecificActor<'pc'>} /> : null;
}
