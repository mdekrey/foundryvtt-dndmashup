import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType } from '../../../types/types';

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
