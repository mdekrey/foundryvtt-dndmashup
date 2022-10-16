import { emptyConditionRuntime } from '@foundryvtt-dndmashup/mashup-react';
import { DamageType, damageTypes, Defense, defenses } from '@foundryvtt-dndmashup/mashup-rules';
import type { CHAT_MESSAGE_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs';
import { ChatSpeakerDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatSpeakerData';
import { applicationDispatcher } from '../../components/foundry/apps-provider';
import { isGame } from '../../core/foundry';

// Types reverse engineered from https://github.com/League-of-Foundry-Developers/Chat-Commands-Lib
type ChatCommands = {
	registerCommand(command: ChatCommand): void;
	createCommandFromData(commandData: {
		commandKey: string;
		shouldDisplayToChat?: boolean;
		invokeOnCommand: ChatCommand['invokeOnCommand'];
		createdMessageType?: CHAT_MESSAGE_TYPES;
		iconClass?: string;
		description?: string;
		gmOnly?: boolean;
	}): ChatCommand;
};

type ChatCommand = {
	commandKey: string;
	shouldDisplayToChat: boolean;
	invokeOnCommand: (
		chatLog: unknown,
		messageText: string,
		chatData: { speaker: ChatSpeakerDataProperties; user: string }
	) => void;
	createdMessageType: CHAT_MESSAGE_TYPES;
	iconClass: string;
	description: string;
	gmOnly: boolean;
};

Hooks.on('chatCommandsReady', function (chatCommands: ChatCommands) {
	chatCommands.registerCommand(
		chatCommands.createCommandFromData({
			commandKey: '/dmg',
			invokeOnCommand: (_, messageText, chatData) => {
				const { baseDice, baseDamageTypes } = parseDamage(messageText);
				const actor = actorFromSpeakerData(chatData.speaker);

				applicationDispatcher.launchApplication('damage', {
					baseDice: baseDice,
					baseDamageTypes: baseDamageTypes,
					title: 'Arbitrary',
					rollType: 'damage',
					listType: 'damageTypes',
					allowToolSelection: false,
					allowCritical: false,
					actor,
					runtimeBonusParameters: { ...emptyConditionRuntime },
				});
			},
			description: 'Launch arbitrary damage dialog',
		})
	);

	chatCommands.registerCommand(
		chatCommands.createCommandFromData({
			commandKey: '/crit',
			invokeOnCommand: (_, messageText, chatData) => {
				const { baseDice, baseDamageTypes } = parseDamage(messageText);
				const actor = actorFromSpeakerData(chatData.speaker);

				applicationDispatcher.launchApplication('criticalDamage', {
					baseDice: baseDice,
					baseDamageTypes: baseDamageTypes,
					title: 'Arbitrary',
					rollType: 'critical-damage',
					listType: 'damageTypes',
					allowToolSelection: false,
					actor,
					runtimeBonusParameters: { ...emptyConditionRuntime },
				});
			},
			description: 'Launch arbitrary critical damage dialog',
		})
	);

	chatCommands.registerCommand(
		chatCommands.createCommandFromData({
			commandKey: '/attack',
			invokeOnCommand: (_, messageText, chatData) => {
				const { baseDice, defense } = parseAttack(messageText);
				const actor = actorFromSpeakerData(chatData.speaker);

				applicationDispatcher.launchApplication('attackRoll', {
					baseDice,
					title: 'Arbitrary',
					rollType: 'attack-roll',
					defense,
					allowToolSelection: false,
					actor,
					runtimeBonusParameters: { ...emptyConditionRuntime },
				});
			},
			description: 'Launch arbitrary critical damage dialog',
		})
	);
});

function parseAttack(attackText: string) {
	const parts = attackText.split(' ');
	const defense = parts.map((p) => p.toLowerCase()).find((p): p is Defense => defenses.includes(p as Defense)) ?? 'ac';

	return {
		baseDice: `1d20 + ${parts
			.filter((p) => !defenses.includes(p as Defense) && p !== 'vs' && p !== 'vs.')
			.join(' ')
			.replace(/^\++/, '')}`,
		defense,
	};
}

function parseDamage(damageText: string) {
	const parts = damageText.split(' ').map((p) => p.replace(/,/g, ''));
	const resultTypes = parts.filter((p): p is DamageType => damageTypes.includes(p.toLowerCase() as DamageType));
	return {
		baseDice: parts.filter((p) => !damageTypes.includes(p.toLowerCase() as DamageType) && p !== 'and').join(' '),
		baseDamageTypes: resultTypes,
	};
}

function actorFromSpeakerData(speaker: ChatSpeakerDataProperties) {
	return (
		(!isGame(game)
			? null
			: speaker.scene && speaker.token
			? game.scenes?.get(speaker.scene)?.tokens.get(speaker.token)?.actor
			: speaker.actor
			? game.actors?.get(speaker.actor)
			: null) ?? null
	);
}
