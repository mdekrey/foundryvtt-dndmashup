import { AuraEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { PowerEffectTemplate } from './power-effect-template';
import { getBounds } from './getBounds';

export function getAuras(token: TokenDocument, scene: Scene): AuraEffect[] {
	const originalBounds = getBounds(token);
	if (!originalBounds) return [];
	return [
		...scene.tokens.contents.flatMap((otherToken) => {
			const source = otherToken.actor;
			if (source)
				return source.allAuras
					.filter((aura) => {
						const bounds = getBounds({ auraSize: aura.range, token: otherToken });
						if (!bounds) return false;
						return originalBounds.intersects(bounds);
					})
					.flatMap((aura) => aura);
			return [];
		}),
		...scene.templates.contents.flatMap((template): AuraEffect[] | AuraEffect => {
			if (!(template.object instanceof PowerEffectTemplate)) return [];
			return template.object.getAurasAt(originalBounds);
		}),
	];
}
