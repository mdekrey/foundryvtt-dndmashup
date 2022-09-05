import { TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';

export type TriggeredEffectChatMessage = {
	triggeredEffect: TriggeredEffect;
};

declare global {
	interface MashupChatMessage {
		'triggered-effect': TriggeredEffectChatMessage;
	}
}
