import { ActorDocument } from '../../module/actor/documentType';
import './registration';

export type LongRestApplicationParameters = {
	actor: ActorDocument;
};

declare global {
	interface MashupApplication {
		longRest: LongRestApplicationParameters;
	}
}
