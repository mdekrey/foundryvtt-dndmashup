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
import { systemName } from './module/constants';

import './fixup';
import { attachToChat } from './module/chat/attach';

// Initialize system
Hooks.once('init', async () => {
	console.log(`${systemName} | Initializing ${systemName}`);

	// Register custom system settings
	registerSettings();

	// Register custom sheets (if any)
	registerCustomSheets();

	// Set an id so styles work better
	document.body.setAttribute('id', 'foundry-tailwind-hack');
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
