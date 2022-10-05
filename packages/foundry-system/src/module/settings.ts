import { MashupActor, MashupActorSheet } from './actor';
import { MashupItemProxy } from './item/mashup-item-proxy';
import { MashupItemBase } from './item/mashup-item';
import { MashupItemSheet } from './item/mashup-item-sheet';
import { MashupActiveEffect } from './active-effect';
import { PowerEffectTemplate } from './aura/power-effect-template';
import { MashupToken, MashupTokenDocument } from './token/mashup-token-document';

declare global {
	interface DocumentClassConfig {
		ActiveEffect: typeof MashupActiveEffect;
		Actor: typeof MashupActor;
		Item: typeof MashupItemBase;
		Token: typeof MashupTokenDocument;
	}
	interface PlaceableObjectClassConfig {
		MeasuredTemplate: typeof PowerEffectTemplate;
		Token: typeof MashupToken;
	}
}

export function registerSettings(): void {
	// Register any custom system settings here
	// TODO - figure out the formula for initiative
	// CONFIG.Combat.initiative = {
	// 	formula: '1d20 + @abilities.dex.mod',
	// 	decimals: 2,
	// };

	CONFIG.Actor.documentClass = MashupActor;
	CONFIG.Item.documentClass = MashupItemProxy as any;
	CONFIG.ActiveEffect.documentClass = MashupActiveEffect;
	CONFIG.MeasuredTemplate.objectClass = PowerEffectTemplate;
	CONFIG.Token.documentClass = MashupTokenDocument;
	CONFIG.Token.objectClass = MashupToken;
}

export function registerCustomSheets() {
	// Register custom sheets (if any)
	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('actor', MashupActorSheet, { makeDefault: true });

	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('item', MashupItemSheet, { makeDefault: true });
}
