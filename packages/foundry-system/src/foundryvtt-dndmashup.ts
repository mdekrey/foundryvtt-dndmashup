/* eslint-disable @typescript-eslint/no-non-null-assertion */
/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />
/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system.
 */

// Import TypeScript modules
import { registerSettings, registerCustomSheets } from './module/settings';
import { systemName, rootPath } from './module/constants';

import './module/applications';
import './module/conditions';
import { attachToChat } from './module/chat';

import './styles/foundryvtt-dndmashup.css';
import './module/chat/power';
import { libWrapper } from './libwrapper-shim';
import { AbilityTerm, parseWrapper, WeaponTerm } from './module/dice';
import { onNextTurn } from './module/active-effect/turns';
import { handleUpdateAuras } from './module/aura/handleUpdateAuras';
import { isGame } from './core/foundry';
import { environment } from './environments/environment';

const bloodiedIcon = `${rootPath}/status-effects/icons/drop.svg`;
const dazedIcon = `${rootPath}/status-effects/icons/star-swirl.svg`;
const dominatedIcon = `${rootPath}/status-effects/icons/psychic-waves.svg`;
const dyingIcon = `${rootPath}/status-effects/icons/pummeled.svg`;
const immobilizedIcon = `${rootPath}/status-effects/icons/nailed-foot.svg`;
const helplessIcon = `${rootPath}/status-effects/icons/despair.svg`;
const petrifiedIcon = `${rootPath}/status-effects/icons/stone-bust.svg`;
const stunnedIcon = `${rootPath}/status-effects/icons/knockout.svg`;
const slowedIcon = `${rootPath}/status-effects/icons/snail.svg`;
const surprisedIcon = `${rootPath}/status-effects/icons/surprised.svg`;
const weakenedIcon = `${rootPath}/status-effects/icons/back-pain.svg`;

// Initialize system
Hooks.once('init', async () => {
	console.log(`${systemName} | Initializing ${systemName}`);

	// Register custom system settings
	registerSettings();

	// Register custom sheets (if any)
	registerCustomSheets();

	// Set an id so styles work better
	document.body.setAttribute('id', 'foundry-tailwind-hack');

	CONFIG.Combat.initiative.formula = '1d20 + @actor.system.initiative + @actor.system.initiative/100';

	CONFIG.Dice.termTypes['WeaponTerm'] = WeaponTerm;
	CONFIG.Dice.termTypes['AbilityTerm'] = AbilityTerm;

	CONFIG.statusEffects = [
		// These are foundry statuses, but aren't really "statuses" in 4e
		CONFIG.statusEffects.find((se) => se.id === 'dead')!,
		{ id: 'bloodied', label: 'Bloodied', icon: bloodiedIcon },

		// The following are actual conditions in 4e:
		{
			id: 'blinded',
			label: 'Blinded',
			icon: CONFIG.statusEffects.find((se) => se.id === 'blind')!.icon,
			flags: {
				mashup: {
					bonuses: [
						{
							target: 'check',
							amount: -10,
							condition: { rule: 'manual', parameter: { conditionText: 'perceiving using sight' } },
						},
					],
				},
			},
		},
		{ id: 'dazed', label: 'Dazed', icon: dazedIcon },
		{
			id: 'deafened',
			label: 'Deafened',
			icon: CONFIG.statusEffects.find((se) => se.id === 'deaf')!.icon,
			flags: {
				mashup: {
					bonuses: [
						{
							target: 'check',
							amount: -10,
							condition: { rule: 'manual', parameter: { conditionText: 'perceiving using sound' } },
						},
					],
				},
			},
		},
		{ id: 'dominated', label: 'Dominated', icon: dominatedIcon },
		{
			id: 'dying',
			label: 'Dying',
			icon: dyingIcon,
			flags: {
				mashup: {
					bonuses: [
						{ target: 'defense-ac', amount: -5, condition: null },
						{ target: 'defense-fort', amount: -5, condition: null },
						{ target: 'defense-refl', amount: -5, condition: null },
						{ target: 'defense-will', amount: -5, condition: null },
					],
				},
			},
		},
		{ id: 'helpless', label: 'Helpless', icon: helplessIcon },
		{ id: 'immobilized', label: 'Immobilized', icon: immobilizedIcon },
		{
			id: 'marked',
			label: 'Marked',
			icon: CONFIG.statusEffects.find((se) => se.id === 'target')?.icon,
			flags: {
				mashup: {
					bonuses: [
						{ target: 'attack-roll', amount: -2, condition: { rule: 'targetsDoNotIncludeSource', parameter: null } },
					],
				},
			},
		},
		{
			id: 'petrified',
			label: 'Petrified',
			icon: petrifiedIcon,
			flags: {
				mashup: {
					bonuses: [{ target: 'all-resistance', amount: 20, condition: null }],
				},
			},
		},
		{
			id: 'prone',
			label: 'Prone',
			icon: CONFIG.statusEffects.find((se) => se.id === 'prone')!.icon,
			flags: {
				mashup: {
					bonuses: [
						{
							target: 'defense-ac',
							amount: 2,
							condition: { rule: 'manual', parameter: { conditionText: 'targetted by a non-adjacent ranged attack' } },
						},
						{
							target: 'defense-fort',
							amount: 2,
							condition: { rule: 'manual', parameter: { conditionText: 'targetted by a non-adjacent ranged attack' } },
						},
						{
							target: 'defense-refl',
							amount: 2,
							condition: { rule: 'manual', parameter: { conditionText: 'targetted by a non-adjacent ranged attack' } },
						},
						{
							target: 'defense-will',
							amount: 2,
							condition: { rule: 'manual', parameter: { conditionText: 'targetted by a non-adjacent ranged attack' } },
						},
						{ target: 'attack-roll', amount: -2, condition: null },
					],
				},
			},
		},
		{
			id: 'restrained',
			label: 'Restrained',
			icon: CONFIG.statusEffects.find((se) => se.id === 'restrain')!.icon,
			flags: { mashup: { bonuses: [{ target: 'attack-roll', amount: -2, condition: null }] } },
		},
		{ id: 'slowed', label: 'Slowed', icon: slowedIcon /* TODO: speed 2 - #70 */ },
		{ id: 'stunned', label: 'Stunned', icon: stunnedIcon },
		{ id: 'surprised', label: 'Surprised', icon: surprisedIcon },
		{
			...CONFIG.statusEffects.find((se) => se.id === 'unconscious')!,
			flags: {
				mashup: {
					bonuses: [
						{ target: 'defense-ac', amount: -5, condition: null },
						{ target: 'defense-fort', amount: -5, condition: null },
						{ target: 'defense-refl', amount: -5, condition: null },
						{ target: 'defense-will', amount: -5, condition: null },
					],
				},
			},
		},
		{ id: 'weakened', label: 'Weakened', icon: weakenedIcon /* TODO: half-damage - #71 */ },
	];

	libWrapper.register(systemName, 'Combat.prototype.nextTurn', onNextTurn);

	libWrapper.register(systemName, 'Roll.parse', parseWrapper);
});

Hooks.on('getSceneControlButtons', function (controls) {
	//create addtioanl button in measure templates for burst
	const measureControls = controls.find((ctrl) => ctrl.name === 'measure');
	if (measureControls) {
		removeMeasure(measureControls.tools, 'circle');

		measureControls.tools.splice(0, 0, {
			name: 'circle',
			title: 'Square Template from the Center',
			icon: 'fas fa-expand-arrows-alt',
		});
	}

	function removeMeasure(tools: SceneControlTool[], name: string) {
		const index = tools.findIndex((tool) => tool.name === name);
		if (index !== -1) tools.splice(index, 1);
	}
});

if (!environment.production) CONFIG.debug.hooks = true;

// Setup system
Hooks.once('setup', async () => {
	// Do anything after initialization but before
	// ready
});

// When ready
Hooks.once('ready', async () => {
	// Do anything once the system is ready
	if (!isGame(game)) return; // this return never happens, but gets TypeScript to recognize our game.

	const allActors = [...(game.actors?.contents ?? []), ...(canvas?.scene?.tokens.map((t) => t.actor) ?? [])].filter(
		(a): a is Exclude<typeof a, null> => !!a
	);
	allActors.forEach((a) => a.updateAuras()); // since caches don't get calculated until the game is ready, this corrects initiative/maxHp/etc.
});

// Add any additional hooks if necessary
Hooks.on('renderChatMessage', (app: ChatLog, html: JQuery<HTMLElement>, data: ChatMessage.MessageData) => {
	attachToChat(html, data);
});

handleUpdateAuras();
