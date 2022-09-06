import { AuraEffect, filterDisposition, isRuleApplicable } from '@foundryvtt-dndmashup/mashup-rules';
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
					.filter((aura) =>
						filterDisposition(aura.dispositionType, otherToken.data.disposition, token.data.disposition)
					)
					.filter((aura) => !aura.excludeSelf || otherToken.actor !== token.actor)
					.filter((aura) => {
						const bounds = getBounds({ auraSize: aura.range, token: otherToken });
						if (!bounds) return false;
						return originalBounds.intersects(bounds);
					})
					.flatMap((aura) => aura)
					.filter((aura) => aura.condition === null || isRuleApplicable(aura.condition, aura.context, {}));
			return [];
		}),
		...scene.templates.contents.flatMap((template): AuraEffect[] | AuraEffect => {
			if (!(template.object instanceof PowerEffectTemplate)) return [];
			// TODO: dispositions here, too?
			// TODO: conditions here, too?
			return template.object.getAurasAt(originalBounds);
		}),
	];
}
