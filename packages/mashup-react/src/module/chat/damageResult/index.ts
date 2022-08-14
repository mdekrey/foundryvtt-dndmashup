import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType } from '@foundryvtt-dndmashup/mashup-rules';

export * from './DamageResult';

export type DamageResultChatMessage = {
	powerId: undefined | string;
	flavor: string;
	result: RollJson;
	damageTypes: DamageType[];
};

declare global {
	interface MashupChatMessage {
		damageResult: DamageResultChatMessage;
	}
}
