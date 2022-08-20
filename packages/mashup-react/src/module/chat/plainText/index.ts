import '@foundryvtt-dndmashup/mashup-rules';

declare global {
	interface MashupChatMessage {
		'plain-text': string;
	}
}
