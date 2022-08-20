import { ActorDocument } from '../../documentType';
import { PowerDocument } from '../../../item/subtypes/power/dataSourceData';
import { PowerRow } from './PowerRow';
import { CommonActionRow } from './CommonActionRow';
import { CommonAction } from '../../actions';

export function Row({ actor, power }: { actor: ActorDocument; power: PowerDocument | CommonAction }) {
	return 'id' in power ? <PowerRow actor={actor} power={power} /> : <CommonActionRow actor={actor} power={power} />;
}
