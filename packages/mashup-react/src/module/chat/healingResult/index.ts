import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';

export * from './HealingResult';

export type HealingResultChatMessage = {
	powerId: undefined | string;
	toolId: undefined | string;
	flavor: string;
	result: RollJson;

	spendHealingSurge: boolean;
	healingSurge: boolean;
	isTemporary: boolean;
};

declare global {
	interface MashupChatMessage {
		healingResult: HealingResultChatMessage;
	}
}
