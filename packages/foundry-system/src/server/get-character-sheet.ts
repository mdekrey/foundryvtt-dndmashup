import { isFeature, ItemDocument, SkillEntry } from '@foundryvtt-dndmashup/mashup-react';
import { environment } from '../environments/environment';
import { SpecificActor } from '../module/actor';
import { MashupItemEquipment } from '../module/item/subtypes/equipment/class';
import { Actor as ApiActor } from '@foundryvtt-dndmashup/foundry-bridge-api';
import { damageTypes, FullFeatureBonus, toRuleText } from '@foundryvtt-dndmashup/mashup-rules';
import { evaluateAmount } from '../module/bonuses/evaluateAndRoll';
import { ensureSign } from '@foundryvtt-dndmashup/core';

const remoteServerUrl = environment.production ? 'https://4e.dekrey.net' : 'https://localhost:5001';

export async function getCharacterSheet(actor: SpecificActor<'pc'>) {
	const characterSheetPath = (await $.ajax({
		method: 'POST',
		url: `${remoteServerUrl}/foundry/actor`,
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(toActorRequest(actor)),
	})) as string;
	window.open(remoteServerUrl + characterSheetPath);
}

function toActorRequest(actor: SpecificActor<'pc'>): ApiActor {
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
	};
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
