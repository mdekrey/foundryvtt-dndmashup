import { Defense } from '../../../types/types';
import { TokenDocument } from '../../actor';
import { RollJson } from '../../roll/roll-json';

export * from './AttackResult';

export type AttackResultChatMessage = {
	defense: Defense;
	results: { target: TokenDocument; roll: RollJson }[];
};

declare global {
	interface MashupChatMessage {
		attackResult: AttackResultChatMessage;
	}
}
