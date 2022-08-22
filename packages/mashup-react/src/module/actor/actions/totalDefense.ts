import { ActiveEffectDocumentConstructorData } from '../../active-effect/active-effect-document-constructor-data';
import { CommonAction } from './common-action';

export const totalDefenseEffect: ActiveEffectDocumentConstructorData = {
	label: 'Total Defense',
	icon: 'icons/magic/defensive/shield-barrier-blue.webp',
	flags: {
		core: { statusId: 'other' },
		mashup: {
			bonuses: [
				{ target: 'defense-ac', amount: '+2', condition: null },
				{ target: 'defense-refl', amount: '+2', condition: null },
				{ target: 'defense-fort', amount: '+2', condition: null },
				{ target: 'defense-will', amount: '+2', condition: null },
			],
		},
	},
	// TODO: duration
};

export const totalDefense: CommonAction = {
	name: 'Total Defense',
	img: 'icons/magic/defensive/shield-barrier-blue.webp',
	action: 'standard',
	usage: 'at-will',
	hint: '+2 to all Defenses until your next turn',
	isReady: () => true,

	use: async (actor, chatDispatch) => {
		await actor.createActiveEffect(totalDefenseEffect);
		chatDispatch.sendChatMessage('plain-text', actor, '... steels their defenses!!');
	},
};
