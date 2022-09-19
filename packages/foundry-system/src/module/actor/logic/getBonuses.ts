import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { buildConditionContext } from '@foundryvtt-dndmashup/mashup-react';
import {
	AuraEffect,
	combinePoolLimits,
	DynamicListTarget,
	emptyInstantaneousEffect,
	FeatureBonus,
	FullDynamicListEntry,
	FullFeatureBonus,
	FullTriggeredEffect,
	NumericBonusTarget,
	ResolvedPoolBonus,
	SourcedPoolBonus,
	SourcedPoolLimits,
	Trigger,
} from '@foundryvtt-dndmashup/mashup-rules';
import uniq from 'lodash/fp/uniq';
import { fromMashupId } from '../../../core/foundry';
import type { MashupActiveEffect } from '../../active-effect';
import { getRelevantAuras } from '../../aura/getAuras';
import { MashupPower } from '../../item/subtypes/power/class';
import type { MashupActor } from '../mashup-actor';

function appliedAuraEffect(actor: MashupActor, predicate: (aura: AuraEffect) => boolean) {
	if (!actor.isInitialized) return [];
	const tokenAndScene = getTokenAndScene(actor);

	if (tokenAndScene) {
		const [token, scene] = tokenAndScene;
		return getRelevantAuras(token, scene, predicate);
	}
	return [];
}

function getTokenAndScene(actor: MashupActor): [TokenDocument, Scene] | null {
	if (actor.isToken && actor.token && actor.token.parent) {
		return [actor.token, actor.token.parent];
	}

	if (canvas?.scene) {
		const token = canvas.scene.tokens.find((t) => t.actor === actor);
		if (token) {
			return [token, canvas.scene];
		}
	}

	return null;
}

export function getBonuses(actor: MashupActor, target: NumericBonusTarget): FullFeatureBonus[] {
	const internal: FullFeatureBonus[] = [
		...actor.effects.contents.flatMap((effect) => effect.allBonuses().map(addEffectContext(effect, actor))),
		...actor.data._source.data.bonuses.map((bonus) => ({
			...bonus,
			source: actor,
			context: buildConditionContext({ actor, item: undefined, activeEffectSources: undefined }),
		})),
		...actor.data.items.contents.flatMap((item) =>
			item
				.allGrantedBonuses()
				.map((bonus) => ({ ...bonus, context: buildConditionContext({ actor, item, activeEffectSources: undefined }) }))
		),
	].filter((b) => b.target === target);

	return [
		...internal,
		...appliedAuraEffect(actor, (aura) => aura.bonuses.filter((b) => b.target === target).length > 0).flatMap((aura) =>
			aura.bonuses
				.filter((b) => b.target === target)
				.map(
					(b): FullFeatureBonus => ({
						...b,
						source: aura.sources[0],
						context: buildConditionContext({ actor, item: undefined, activeEffectSources: undefined }),
					})
				)
		),
	];
}

function addEffectContext(effect: MashupActiveEffect, actor: MashupActor) {
	const originalSources = effect.data.flags.mashup?.originalSources
		?.map(fromMashupId)
		.filter(Boolean) as BaseDocument[];
	return (bonus: FeatureBonus): FullFeatureBonus => ({
		...bonus,
		context: buildConditionContext({ actor, item: undefined, activeEffectSources: originalSources }),
		source: effect,
	});
}

export function getAllBonuses(actor: MashupActor): FullFeatureBonus[] {
	const internal: FullFeatureBonus[] = [
		...actor.effects.contents.flatMap((effect) => effect.allBonuses().map(addEffectContext(effect, actor))),
		...actor.data._source.data.bonuses.map((bonus) => ({
			...bonus,
			source: actor,
			context: buildConditionContext({ actor, item: undefined, activeEffectSources: undefined }),
		})),
		...actor.data.items.contents.flatMap((item) =>
			item
				.allGrantedBonuses()
				.map((bonus) => ({ ...bonus, context: buildConditionContext({ actor, item, activeEffectSources: undefined }) }))
		),
	];

	return [
		...internal,
		...appliedAuraEffect(actor, (aura) => aura.bonuses.length > 0).flatMap((aura) =>
			aura.bonuses.map(
				(b): FullFeatureBonus => ({
					...b,
					source: aura.sources[0],
					context: buildConditionContext({ actor, item: undefined, activeEffectSources: undefined }),
				})
			)
		),
	];
}

export function getList(actor: MashupActor, target: DynamicListTarget): FullDynamicListEntry[] {
	const internal: FullDynamicListEntry[] = [
		// TODO: effects grant list entries
		// ...actor.effects.contents.flatMap((effect) =>
		// 	effect.allBonuses().map((bonus) => ({ ...bonus, context: { actor: actor }, source: effect }))
		// ),
		...actor.data._source.data.dynamicList.map((list) => ({ ...list, source: actor, context: { actor: actor } })),
		...actor.data.items.contents.flatMap((item) =>
			item.allDynamicList().map((bonus) => ({ ...bonus, context: { actor: actor, item } }))
		),
	].filter((b) => b.target === target);

	return [
		...internal,
		// TODO: auras grant list entries
		// ...appliedAuraEffect(actor, (aura) => aura.bonuses.filter((b) => b.target === target).length > 0).flatMap((aura) =>
		// 	aura.bonuses
		// 		.filter((b) => b.target === target)
		// 		.map((b): FullFeatureBonus => ({ ...b, source: aura.sources[0], context: { actor: actor } }))
		// ),
	];
}

export function getAllLists(actor: MashupActor): FullDynamicListEntry[] {
	return [
		...actor.data._source.data.dynamicList.map((bonus) => ({ ...bonus, source: actor, context: { actor: actor } })),
		...actor.data.items.contents.flatMap((item) =>
			item.allDynamicList().map((entry) => ({ ...entry, context: { actor: actor, item } }))
		),
		// TODO: auras grant list entries
		// ...appliedAuraEffect(actor, (aura) => aura..length > 0)
	];
}

export function getBaseGrantedPools(actor: MashupActor): SourcedPoolLimits[] {
	return actor.items.contents.flatMap((item) => item.allGrantedPools());
}

export function getPoolBonuses(actor: MashupActor, poolName: string): SourcedPoolBonus[] {
	return actor.items.contents
		.flatMap<SourcedPoolBonus>((item) => item.allGrantedPoolBonuses())
		.filter((bonus) => bonus.name === poolName);
}

export function getPoolResult(
	actor: MashupActor,
	base: SourcedPoolLimits,
	modifiers: SourcedPoolBonus[]
): SourcedPoolLimits {
	return modifiers.reduce((prev, next) => {
		const resolved: ResolvedPoolBonus = {
			...next,
			amount:
				typeof next.amount === 'number' ? next.amount : new Roll(next.amount, { actor }).roll({ async: false })._total,
		};
		return {
			...combinePoolLimits(prev, resolved),
			source: 'source' in next ? uniq([...prev.source, next.source]) : prev.source,
		};
	}, base);
}

export function getTriggeredEffects(actor: MashupActor): FullTriggeredEffect[] {
	const internal: FullTriggeredEffect[] = [
		...actor.effects.contents.flatMap((effect: MashupActiveEffect) =>
			effect.allTriggeredEffects().map((bonus) => ({ ...bonus, context: { actor: actor }, sources: [effect] }))
		),
		...actor.data.items.contents.flatMap((item) =>
			item.allTriggeredEffects().map((bonus) => ({ ...bonus, context: { actor: actor, item } }))
		),
		...Object.entries(actor.data.data.powerUsage ?? {})
			.map(([powerId, used]) => used !== 0 && actor.allPowers(true).find((p) => p.powerGroupId === powerId))
			.filter((p): p is MashupPower => !!p && p.type === 'power')
			.filter(
				(power): power is MashupPower & { data: { data: { rechargeTrigger: Trigger } } } =>
					!!power.data.data.rechargeTrigger
			)
			.map(
				(power): FullTriggeredEffect => ({
					effect: {
						...emptyInstantaneousEffect,
						text: `Recharge ${power.name}`,
					},
					trigger: power.data.data.rechargeTrigger,
					condition: null,
					sources: [power],
					context: { actor, item: power },
				})
			),
	];
	console.log(actor.name, actor.data.data.powerUsage, actor, internal);

	return [
		...internal,
		...appliedAuraEffect(actor, (aura) => aura.triggeredEffects.length > 0).flatMap((aura) =>
			aura.triggeredEffects.map(
				(b): FullTriggeredEffect => ({ ...b, sources: aura.sources, context: { actor: actor } })
			)
		),
	];
}
