import {
	ActionType,
	effectsToRules,
	EffectTypeAndRange,
	effectTypeAndRangeText,
	EquipmentDocument,
	isFeature,
	isPower,
	ItemDocument,
	PowerDocument,
	PowerEffect,
	PowerUsage,
	SkillEntry,
	toAttackRollText,
} from '@foundryvtt-dndmashup/mashup-react';
import { environment } from '../environments/environment';
import { SpecificActor } from '../module/actor';
import { MashupItemEquipment } from '../module/item/subtypes/equipment/class';
import { Actor as ApiActor, Power, PowerRulesText } from '@foundryvtt-dndmashup/foundry-bridge-api';
import { DamageEffect, damageTypes, FullFeatureBonus, toRuleText } from '@foundryvtt-dndmashup/mashup-rules';
import { evaluateAmount } from '../module/bonuses/evaluateAndRoll';
import { ensureSign, neverEver, oxfordComma } from '@foundryvtt-dndmashup/core';
import { capitalize, uniqBy } from 'lodash/fp';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { getToolsForPower } from '../module/applications/diceRoll/getToolsForPower';
import { MashupDiceContext } from '../module/dice/MashupDiceContext';
import { WeaponTerm } from '../module/dice';

const remoteServerUrl = environment.production ? 'https://4e.dekrey.net' : 'https://localhost:5001';

export async function getCharacterSheet(actor: SpecificActor<'pc'>) {
	try {
		const characterSheetPath = (await $.ajax({
			method: 'POST',
			url: `${remoteServerUrl}/foundry/actor`,
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(await toActorRequest(actor)),
		})) as string;
		window.open(remoteServerUrl + characterSheetPath);
	} catch (ex) {
		console.error(ex);
		ui.notifications?.error('Could not generate character sheet - see log');
	}
}

async function toActorRequest(actor: SpecificActor<'pc'>): Promise<ApiActor> {
	return {
		name: actor.name ?? undefined,
		// bonuses: actor.system.bonuses,
		// dynamicList: actor.system.dynamicList,
		class: actor.appliedClass?.name ?? undefined,
		race: actor.appliedRace?.name ?? undefined,
		paragonPath: actor.appliedParagonPath?.name ?? undefined,
		epicDestiny: actor.appliedEpicDestiny?.name ?? undefined,
		equipment:
			actor.items.contents.filter((i): i is MashupItemEquipment => i.type === 'equipment').map(toEquipmentRequest) ??
			undefined,
		// TODO: get features from class/race/paragonPath/epicDestiny
		// features: actor.items.contents.filter((i): i is MashupItemFeature => i.type === 'feature').map(toFeatureRequest),
		// powers: actor.items.contents.filter((i): i is MashupPower => i.type === 'power').map(toPowerRequest),
		skills: (actor.system.skills ?? []).map(toSkillRequest),

		maxHp: actor.derivedCache.bonuses.getValue('maxHp'),
		healingSurgeValue: actor.derivedCache.bonuses.getValue('surges-value'),
		surgesPerDay: actor.derivedCache.bonuses.getValue('surges-max'),

		// details: actor.system.details,
		abilities: {
			str: actor.derivedCache.bonuses.getValue('ability-str'),
			con: actor.derivedCache.bonuses.getValue('ability-con'),
			dex: actor.derivedCache.bonuses.getValue('ability-dex'),
			int: actor.derivedCache.bonuses.getValue('ability-int'),
			wis: actor.derivedCache.bonuses.getValue('ability-wis'),
			cha: actor.derivedCache.bonuses.getValue('ability-cha'),
		},
		currency: actor.system.currency,

		level: actor.system.details.level,
		age: actor.system.details.age,
		totalXp: actor.system.details.exp,
		pronouns: actor.system.details.pronouns,
		adventuringCompany: actor.system.details.adventuringCompany,
		height: actor.system.details.height,
		weight: actor.system.details.weight,
		deity: actor.system.details.deity,
		size: actor.size.substring(0, 1).toUpperCase(),

		languages: actor.derivedCache.lists.getApplied('languagesKnown').map((e) => e.entry),
		weaponArmorProficiencies: [
			actor.derivedCache.lists
				.getApplied('proficiencies')
				.map((e) => e.entry)
				.join(', '),
		],

		classFeatures: [
			...(actor.appliedClass?.items.contents.filter((i) => i.type === 'feature') ?? []),
			...actor.items.contents.filter(
				(item: ItemDocument) => isFeature(item) && item.system.featureType === 'class-feature'
			),
		].map((i) => i.displayName ?? ''),
		raceFeatures: [
			...(actor.appliedRace?.items.contents.filter((i) => i.type === 'feature') ?? []),
			...actor.items.contents.filter(
				(item: ItemDocument) => isFeature(item) && item.system.featureType === 'race-feature'
			),
		].map((i) => i.displayName ?? ''),
		feats: actor.items.contents
			.filter((item: ItemDocument) => isFeature(item) && item.system.featureType === 'feat')
			.map((i) => i.displayName ?? ''),

		speed: toModifiers(actor.derivedCache.bonuses.getApplied('speed')),
		defenses: {
			ac: toModifiers(actor.derivedCache.bonuses.getApplied('defense-ac')),
			acConditional: toConditionalModifiers(actor.derivedCache.bonuses.getIndeterminate('defense-ac')),
			fort: toModifiers(actor.derivedCache.bonuses.getApplied('defense-fort')),
			fortConditional: toConditionalModifiers(actor.derivedCache.bonuses.getIndeterminate('defense-fort')),
			refl: toModifiers(actor.derivedCache.bonuses.getApplied('defense-refl')),
			reflConditional: toConditionalModifiers(actor.derivedCache.bonuses.getIndeterminate('defense-refl')),
			will: toModifiers(actor.derivedCache.bonuses.getApplied('defense-will')),
			willConditional: toConditionalModifiers(actor.derivedCache.bonuses.getIndeterminate('defense-will')),
		},

		savingThrowModifiers: toConditionalModifiers([
			...actor.derivedCache.bonuses.getApplied('saving-throw'),
			...actor.derivedCache.bonuses.getIndeterminate('saving-throw'),
		]),

		resistances: [
			...toConditionalModifiers(actor.derivedCache.bonuses.getApplied('all-resistance'), (pos) =>
				pos ? 'resistance to all damage' : 'vulnerability to all damage'
			),
			...toConditionalModifiers(actor.derivedCache.bonuses.getApplied('all-vulnerability'), (pos) =>
				pos ? 'vulnerability to all damage' : 'resistance to all damage'
			),
			...damageTypes.flatMap((damageType) => [
				...toConditionalModifiers(actor.derivedCache.bonuses.getApplied(`${damageType}-resistance`), (pos) =>
					pos ? `${damageType} resistance` : `${damageType} vulnerability`
				),
				...toConditionalModifiers(actor.derivedCache.bonuses.getApplied(`${damageType}-vulnerability`), (pos) =>
					pos ? `${damageType} vulnerability` : `${damageType} resistance`
				),
			]),
		],

		powers: await actor
			.allPowers(true)
			.flatMap((p) => [p, ...(p.items.contents as SimpleDocument[]).filter(isPower)])
			.map(async (power) => {
				const firstEffect = power.system.effects[0] ?? null;

				return {
					name: power.name ?? '',
					flavorText: power.system.flavorText,
					display: power.system.type,
					usage: toStandardUsage(power.system.usage),
					keywords: power.system.keywords.map(capitalize),
					actionType: toActionType(power.system.actionType),
					attackType: toAttackType(firstEffect?.typeAndRange?.type),
					attackTypeDetails: firstEffect?.typeAndRange ? effectTypeAndRangeText(firstEffect?.typeAndRange, true) : '',
					prerequisite: power.system.prerequisite ?? null,
					requirement: power.system.requirement ?? null,
					trigger: power.system.trigger ?? null,
					target: firstEffect?.target,
					attack: firstEffect?.attackRoll ? toAttackRollText(firstEffect?.attackRoll) : null,
					rulesText: [...effectsToRules(power.system.effects), ...(await weaponCalculations(power, actor))],
					isBasic: power.system.isBasic,
				};
			})
			.reduce(async (a, b) => [...(await a), await b], Promise.resolve([] as Power[])),
	};
}

async function weaponCalculations(power: PowerDocument, actor: SpecificActor<'pc'>): Promise<PowerRulesText[]> {
	const tools = getToolsForPower(actor, power, { requireEquipped: false });
	if (!tools?.length) {
		const calculations = await power.system.effects
			.map(async (e) => await applyCalculation(e, undefined))
			.reduce(async (a, b) => [...(await a), ...(await b)], Promise.resolve([]));
		if (!calculations.length) return [];

		return [{ label: 'Calculated', text: calculations.join(' / ') }];
	} else {
		const results = await tools
			.map(async (tool) => {
				const calculations = await power.system.effects
					.map(async (e) => await applyCalculation(e, tool))
					.reduce(async (a, b) => [...(await a), ...(await b)], Promise.resolve([]));
				if (!calculations.length) return [];

				return [{ label: tool.name ?? '', text: calculations.join(' / ') }];
			})
			.reduce(async (a, b) => [...(await a), ...(await b)], Promise.resolve([]));
		return uniqBy<PowerRulesText>((v) => `${v.label}: ${v.text}`, results);
	}

	async function applyCalculation(powerEffect: PowerEffect, tool: EquipmentDocument | undefined) {
		const result: string[] = [];
		if (powerEffect.attackRoll) {
			result.push(
				toAttackRollText({
					...powerEffect.attackRoll,
					attack: await evaluateAttack(powerEffect.attackRoll.attack, tool),
				})
			);
		}
		if (powerEffect.hit?.damage) {
			result.push(`hit ${await evaluateDamage(powerEffect.hit.damage, tool)}`);
		}
		if (powerEffect.miss?.damage) {
			result.push(`miss ${await evaluateDamage(powerEffect.miss.damage, tool)}`);
		}
		if (powerEffect.name && result.length) {
			return [`${powerEffect.name} (${result.join(' / ')})`];
		}
		return result;
	}

	async function evaluateAttack(attackBase: string, tool: EquipmentDocument | undefined) {
		const context: MashupDiceContext = {
			actor,
			item: tool,
		};
		const bonusesFromTool =
			tool
				?.allGrantedBonuses(true)
				?.filter((b) => b.target === 'attack-roll' && !b.condition)
				.map((b) => `+ ${b.amount}`)
				.join('') ?? '';
		return ensureSign(await rollFormula(attackBase + bonusesFromTool, context));
	}

	async function evaluateDamage(damage: DamageEffect, tool: EquipmentDocument | undefined) {
		const context: MashupDiceContext = {
			actor,
			item: tool,
		};
		const bonusesFromTool =
			tool
				?.allGrantedBonuses(true)
				?.filter((b) => b.target === 'damage' && !b.condition)
				.map((b) => `+ ${b.amount}`)
				.join('') ?? '';
		return `${await rollFormula(damage.damage + bonusesFromTool, context)} ${oxfordComma(damage.damageTypes)} damage`;
	}
}

async function rollFormula(formula: string, context: MashupDiceContext) {
	let roll = Roll.create(formula, context);
	if (roll.isDeterministic) {
		await roll.evaluate({ async: true });
		return (roll.total ?? 0).toFixed(0);
	}
	roll = Roll.fromTerms(await combineTerms(await simplifyTerms(roll.terms, context), context));
	return roll.formula;
}

async function simplifyTerms(terms: RollTerm[], context: MashupDiceContext): Promise<RollTerm[]> {
	return terms
		.map(async (term): Promise<RollTerm> => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (term instanceof WeaponTerm) return DiceTerm.fromMatch(DiceTerm.matchTerm(term.term)!);
			return term;
		})
		.reduce(async (a, b) => [...(await a), await b], Promise.resolve<RollTerm[]>([]));
}
async function combineTerms(terms: RollTerm[], context: MashupDiceContext): Promise<RollTerm[]> {
	const result: RollTerm[] = [];
	let currentDeterministic: RollTerm[] = [];
	for (const term of terms) {
		if (term.isDeterministic) currentDeterministic.push(term);
		else {
			await determine();
			result.push(term);
		}
	}
	await determine();
	return result;

	async function determine() {
		if (currentDeterministic.length === 0) return;
		if (currentDeterministic.length === 1 && currentDeterministic[0] instanceof OperatorTerm) {
			result.push(...currentDeterministic);
			return;
		}
		const determined = await rollFormula(Roll.fromTerms(currentDeterministic).formula, context);
		currentDeterministic = [];
		const next = Roll.parse(determined, context);
		if (result.length && !(next[0] instanceof OperatorTerm)) {
			result.push(new OperatorTerm({ operator: '+' }));
		}
		result.push(...next);
	}
}

function toStandardUsage(usage: PowerUsage) {
	switch (usage) {
		case 'at-will':
			return 'At-Will';
		case 'encounter':
			return 'Encounter';
		case 'daily':
			return 'Daily';
		case 'item':
			return 'Item';
		case 'item-consumable':
			return 'Item (consumable)';
		case 'item-healing-surge':
			return 'Item (healing surge)';
		case 'other':
			return 'Special';
		default:
			return neverEver(usage);
	}
}
type ActionTypeLegacy = ActionType | 'immediate';
function toActionType(actionType: ActionTypeLegacy) {
	switch (actionType) {
		case 'standard':
			return 'Standard';
		case 'move':
			return 'Move';
		case 'minor':
			return 'Minor';
		case 'free':
			return 'Free';
		case 'opportunity':
			return 'Opportunity';
		case 'immediate':
			return 'Immediate (???)';
		case 'immediate-interrupt':
			return 'Immediate Interrupt';
		case 'immediate-reaction':
			return 'Immediate Reaction';
		case 'none':
			return 'None';
		default:
			return neverEver(actionType);
	}
}
function toEquipmentRequest(equipment: MashupItemEquipment) {
	return equipment.displayName ?? '';
}
function toModifiers(bonuses: FullFeatureBonus[]) {
	return bonuses.map((b) => ({ type: b.type ?? '', amount: evaluateAmount(b.amount, b.context) }));
}
function toConditionalModifiers(
	bonuses: FullFeatureBonus[],
	toWhat: string | ((amountPositive: boolean) => string) = ''
) {
	return bonuses
		.map((b) => {
			const amount = evaluateAmount(b.amount, b.context);
			if (amount === 0) return '';
			const conditionText = b.condition ? toRuleText(b.condition) : '';
			const description =
				typeof toWhat === 'string' ? `${amount > 0 ? 'bonus' : 'penalty'}${toWhat}` : toWhat(amount > 0);
			return `${ensureSign(amount)} ${b.type ?? ''} ${description} ${conditionText}`;
		})
		.filter(Boolean);
}
function toSkillRequest(skill: SkillEntry) {
	return { name: skill.name, modifiers: [{ type: 'ranks', amount: skill.ranks }] };
}
function toAttackType(type: EffectTypeAndRange['type'] | null | undefined): Power['attackType'] | null {
	switch (type) {
		case undefined:
		case null:
			return null;
		case 'melee':
			return 'Melee';
		case 'ranged':
			return 'Ranged';
		case 'within':
		case 'close':
			return 'Close';
		case 'area':
			return 'Area';
		case 'personal':
			return 'Personal';
		default:
			return neverEver(type);
	}
}
