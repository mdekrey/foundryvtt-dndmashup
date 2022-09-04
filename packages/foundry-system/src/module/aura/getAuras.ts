import { FeatureBonus, FullFeatureBonus, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { fromMashupId } from '../../core/foundry';
import { MashupActor } from '../actor/mashup-actor';
import { systemName } from '../constants';
import { MashupItem } from '../item/mashup-item';
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
						if (!bounds) return false;
						return originalBounds.intersects(bounds);
					})
					.flatMap((aura) => aura.bonuses)
					.map((bonus): FullFeatureBonus => ({ ...bonus, source, context: { actor: source } }));
			return [];
		}),
		...scene.templates.contents.flatMap((template): FullFeatureBonus[] => {
			const systemInfo = template.data.flags[systemName] ?? {};
			if (!systemInfo.grantedAuras) return [];
			if (!systemInfo.source) return [];
			const bounds = getBounds(template);
			if (!bounds || !originalBounds.intersects(bounds)) return [];

			const source = fromMashupId(systemInfo.source);
			if (!source) return [];

			const actor = ((systemInfo.actor && fromMashupId(systemInfo.actor)) as MashupActor) ?? undefined;
			const item = ((systemInfo.item && fromMashupId(systemInfo.item)) as MashupItem) ?? undefined;

			return systemInfo.grantedAuras.map(
				(bonus): FullFeatureBonus => ({
					...bonus,
					source: source as unknown as FullFeatureBonus['source'],
					context: {
						actor,
						item,
					},
				})
			);
		}),
	];
}

declare global {
	interface FlagConfig {
		MeasuredTemplate: {
			[systemName]?: {
				grantedAuras?: FeatureBonus[];
				triggeredEffects?: TriggeredEffect[];
				source?: string; // mashup id
				actor?: string; // mashup id
				item?: string; // mashup id
			};
		};
	}
}
