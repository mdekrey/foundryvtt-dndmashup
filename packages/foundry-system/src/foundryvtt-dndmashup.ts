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

import { attachToChat } from './module/chat/attach';

import './styles/foundryvtt-dndmashup.css';
import './module/chat/power';
import { libWrapper } from './libwrapper-shim';
import { PowerEffectTemplate } from './module/power-effect-template';

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

	CONFIG.Combat.initiative.formula = '1d20 + @initiative + @initiative/100';

	CONFIG.statusEffects = [
		// These are foundry statuses, but aren't really "statuses" in 4e
		CONFIG.statusEffects.find((se) => se.id === 'dead')!,
		{ id: 'bloodied', label: 'Bloodied', icon: bloodiedIcon },

		// The following are actual statuses in 4e:
		{ id: 'blinded', label: 'Blinded', icon: CONFIG.statusEffects.find((se) => se.id === 'blind')!.icon },
		{ id: 'dazed', label: 'Dazed', icon: dazedIcon },
		{ id: 'deafened', label: 'Deafened', icon: CONFIG.statusEffects.find((se) => se.id === 'deaf')!.icon },
		{ id: 'dominated', label: 'Dominated', icon: dominatedIcon },
		{ id: 'dying', label: 'Dying', icon: dyingIcon },
		{ id: 'helpless', label: 'Helpless', icon: helplessIcon },
		{ id: 'immobilized', label: 'Immobilized', icon: immobilizedIcon },
		// marked is a different effect since it needs the marking character id
		{ id: 'petrified', label: 'Petrified', icon: petrifiedIcon },
		{ id: 'prone', label: 'Prone', icon: CONFIG.statusEffects.find((se) => se.id === 'prone')!.icon },
		{ id: 'restrained', label: 'Restrained', icon: CONFIG.statusEffects.find((se) => se.id === 'restrain')!.icon },
		{ id: 'slowed', label: 'Slowed', icon: slowedIcon },
		{ id: 'stunned', label: 'Stunned', icon: stunnedIcon },
		{ id: 'surprised', label: 'Surprised', icon: surprisedIcon },
		CONFIG.statusEffects.find((se) => se.id === 'unconscious')!,
		{ id: 'weakened', label: 'Weakened', icon: weakenedIcon },
	];

	libWrapper.register(
		systemName,
		'MeasuredTemplate.prototype._getCircleShape',
		PowerEffectTemplate._getCircleSquareShape
	);

	libWrapper.register(
		systemName,
		'MeasuredTemplate.prototype._refreshRulerText',
		PowerEffectTemplate._refreshRulerBurst
	);
});

Hooks.on('getSceneControlButtons', function (controls) {
	//create addtioanl button in measure templates for burst
	const measureControls = controls.find((ctrl) => ctrl.name === 'measure');
	if (measureControls) {
		let index = measureControls.tools.findIndex((tool) => tool.name === 'cone');
		if (index !== -1) measureControls.tools.splice(index, 1);
		// index = measureControls.tools.findIndex((tool) => tool.name === 'ray');
		// if (index !== -1) measureControls.tools.splice(index, 1);
		index = measureControls.tools.findIndex((tool) => tool.name === 'clear');
		if (index === -1) index = measureControls.tools.length;
		measureControls.tools.splice(index, 0, {
			name: 'rectCenter',
			title: 'Square Template from the Center',
			icon: 'fas fa-external-link-square-alt',
		});
	}
});

// Setup system
Hooks.once('setup', async () => {
	// Do anything after initialization but before
	// ready
});

// When ready
Hooks.once('ready', async () => {
	// Do anything once the system is ready
});

// Add any additional hooks if necessary
Hooks.on('renderChatMessage', (app: ChatLog, html: JQuery<HTMLElement>, data: ChatMessage.MessageData) => {
	attachToChat(html, data);
});
