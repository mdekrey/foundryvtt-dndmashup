import { AuraEffect, filterDisposition } from '@foundryvtt-dndmashup/mashup-rules';
import { PowerEffectTemplate } from './power-effect-template';
import { getBounds } from './getBounds';
import { MashupTokenDocument } from '../token/mashup-token-document';

export function getRelevantAuras(
	token: MashupTokenDocument,
	scene: Scene,
	predicate: (aura: AuraEffect) => boolean
): AuraEffect[] {
	const originalBounds = getBounds(token);
	if (!originalBounds) return [];
	return [
		...scene.tokens.contents.flatMap((otherToken) => {
			if (!otherToken.isActorReady) return [];
			if (otherToken === token) return [];
			const source = otherToken.actor;
			if (source)
				return source
					.getAuras(predicate)
					.filter((aura) => filterDisposition(aura.dispositionType, otherToken.disposition, token.disposition))
					.filter((aura) => !aura.excludeSelf || otherToken.actor !== token.actor)
					.filter((aura) => {
						const bounds = getBounds({ auraSize: aura.range, token: otherToken });
						if (!bounds) return false;
						return (originalBounds as any) /* FIXME: Foundry 10 types */
							.intersects(bounds);
					});
			return [];
		}),
		...scene.templates.contents
			.flatMap((template): AuraEffect[] | AuraEffect => {
				if (!(template.object instanceof PowerEffectTemplate)) return [];
				// TODO: dispositions here, too?
				// TODO: conditions here, too?
				return template.object.getAurasAt(originalBounds);
			})
			.filter(predicate),
	];
}
