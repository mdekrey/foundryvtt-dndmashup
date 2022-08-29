import { ActorDocument } from '../../module/actor/documentType';

export * from './ShortRestConfiguration';

export type ShortRestApplicationParameters = {
	actor: ActorDocument;
};

declare global {
	interface MashupApplication {
		shortRest: ShortRestApplicationParameters;
	}
}
