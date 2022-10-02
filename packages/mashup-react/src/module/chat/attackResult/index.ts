import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, Defense } from '@foundryvtt-dndmashup/mashup-rules';
import { TokenInstance } from '../../actor';

export * from './AttackResult';

export type AttackResultChatMessage = {
	powerId: undefined | string;
	toolId: undefined | string;
	flavor: string;
	defense: Defense;
	results: { target?: TokenInstance; bonuses?: BonusByType; roll: RollJson }[];
};

declare global {
	interface MashupChatMessage {
		attackResult: AttackResultChatMessage;
	}
}
