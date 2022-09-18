import { isGame } from '../../../core/foundry';
import { MashupActor } from '../mashup-actor';

export async function updateBloodied(this: MashupActor) {
	const findEffectId = (statusToCheck: string) => {
		return this.effects.find((effect) => effect.data.flags.core?.statusId === statusToCheck)?.id ?? null;
	};
	const setIfNotPresent = async (statusToCheck: string) => {
		if (!isGame(game)) return;

		const existingEffect = this.effects.find((x) => x.data.flags.core?.statusId === statusToCheck);
		if (existingEffect) return;

		const status = CONFIG.statusEffects.find((x) => x.id === statusToCheck);
		if (!status) return;

		const { _id, id, icon, label, ...params } = status;

		const effect = {
			icon: icon ?? undefined,
			...params,
			label: (label && game.i18n.localize(label)) ?? '<unknown>',
			flags: {
				core: {
					statusId: statusToCheck,
				},
			},
		};
		await this.createActiveEffect(effect, { durationType: 'other', description: 'while HP ≤ Bloodied Value' }, false, [
			this,
		]);
	};

	const calculated = this.derivedData;
	const shouldBeDead = this.data.data.health.hp.value <= 0 && this.data.type === 'monster';
	// const shouldBeDying = this.data.data.health.currentHp <= 0 && this.data.type === 'pc';
	const shouldBeBloodied = !shouldBeDead && Math.floor(calculated.health.hp.max / 2) >= this.data.data.health.hp.value;

	const isBloodied = this.isStatus('bloodied');
	const isDead = this.isStatus('dead');
	// const currentDyingId = findEffectId('dying');

	if (isDead) return;

	if (shouldBeBloodied && !isBloodied) await setIfNotPresent('bloodied');
	if (!shouldBeBloodied && isBloodied)
		await this.deleteEmbeddedDocuments(
			'ActiveEffect',
			[findEffectId('bloodied')].filter((v): v is string => !!v)
		);

	if (shouldBeDead && !isDead) await setIfNotPresent('dead');
}
