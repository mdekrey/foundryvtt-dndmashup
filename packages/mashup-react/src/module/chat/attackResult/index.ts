import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, Defense } from '@foundryvtt-dndmashup/mashup-rules';
import { TokenDocument } from '../../actor';

export * from './AttackResult';

export type AttackResultChatMessage = {
	powerId: undefined | string;
	toolId: undefined | string;
	flavor: string;
	defense: Defense;
	results: { target?: TokenDocument; bonuses?: BonusByType; roll: RollJson }[];
};

declare global {
	interface MashupChatMessage {
		attackResult: AttackResultChatMessage;
	}
}
