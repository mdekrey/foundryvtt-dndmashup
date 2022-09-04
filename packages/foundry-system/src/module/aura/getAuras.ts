import { Aura, FullFeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { systemName } from '../constants';
import { getBounds } from './getBounds';

export function getAuras(token: TokenDocument, scene: Scene): FullFeatureBonus[] {
	const originalBounds = getBounds(token);
	if (!originalBounds) return [];
	return [
		...scene.tokens.contents.flatMap((otherToken) => {
			const source = otherToken.actor;
			if (source)
				return source.allAuras
					.filter((aura) => {
						const bounds = getBounds({ auraSize: aura.range, token: otherToken });
						console.log(aura, otherToken);
						if (!bounds) return false;
						return originalBounds.intersects(bounds);
					})
					.flatMap((aura) => aura.bonuses)
					.map((bonus): FullFeatureBonus => ({ ...bonus, source, context: { actor: source } }));
			return [];
		}),
		// TODO: auras from templates
		// ...scene.templates.contents.flatMap(
		// 	(template) =>
		// 		template.data.flags[systemName].grantedAuras.filter((aura) =>
		// 			{
		// 				return originalBounds.intersects(getBounds({ auraSize: aura.range, token: otherToken }));
		// 			}
		// 		).map((aura) => ) ?? []
		// ),
	];
}

declare global {
	interface FlagConfig {
		MeasuredTemplate: {
			[systemName]?: {
				grantedAuras?: Aura[];
			};
		};
	}
}
