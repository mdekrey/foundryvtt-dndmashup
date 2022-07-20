import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';

// EmbeddedCollection is available at '/common/abstract/embedded-collection.mjs', but TS cannot handle that. Instead,
// adding this file and the fixup.js we're able to access the actual type.

export {};

interface Fixup {
	EmbeddedCollection: typeof EmbeddedCollection;
}

declare global {
	namespace foundry {
		export let fixup: Fixup;
	}
}
