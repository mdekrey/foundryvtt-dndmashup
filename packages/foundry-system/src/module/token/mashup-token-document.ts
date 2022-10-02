import { TokenDocument as InternalTokenDocument } from '@foundryvtt-dndmashup/mashup-react';

export class MashupToken extends Token {
	disposition!: number;
}
export class MashupTokenDocument extends TokenDocument implements InternalTokenDocument {
	disposition!: number;
	x!: number;
	y!: number;
	width!: number;
	height!: number;

	texture!: InternalTokenDocument['texture'];
}
