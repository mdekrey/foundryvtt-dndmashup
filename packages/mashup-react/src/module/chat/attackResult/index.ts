import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { Defense } from '@foundryvtt-dndmashup/mashup-rules';
import { TokenDocument } from '../../actor';

export * from './AttackResult';

export type AttackResultChatMessage = {
	powerId: undefined | string;
	toolId: undefined | string;
	flavor: string;
	defense: Defense;
	results: { target?: TokenDocument; roll: RollJson }[];
};

declare global {
	interface MashupChatMessage {
		attackResult: AttackResultChatMessage;
	}
}
