import { TokenDocument as InternalTokenDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../actor';

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

	isActorReady: boolean;

	constructor(data: any, context: any) {
		super(data, context);

		this.isActorReady = !!this._actor;
	}

	override getActor(): MashupActor | null {
		const result = super.getActor();
		this.isActorReady = true;
		return result;
	}
}
