import { isGame } from '../../core/foundry';
import { MashupActiveEffect } from '../active-effect';
import { MashupActor } from '../actor';

type TokenConstructor = ConstructorParameters<ConstructorOf<TokenDocument>>[0];
type MeasuredTemplateConstructor = ConstructorParameters<ConstructorOf<MeasuredTemplateDocument>>[0];

export function handleUpdateAuras() {
	Hooks.once('canvasReady', async (arg: Canvas) => {
		updateAllTokens(arg.scene);
	});

	Hooks.on<Hooks.UpdateDocument<TokenConstructor>>('updateActor', (arg: MashupActor) => {
		if (isGame(game)) {
			game.scenes?.contents?.forEach((scene) => {
				if (scene.tokens.find((t) => t.actor?.id === arg.id)) {
					updateAllTokens(scene);
				}
			});
		}
		// console.log('updateToken', arg);
	});

	Hooks.on<Hooks.UpdateDocument<TokenConstructor>>('updateToken', (arg: TokenDocument) => {
		if (arg.actor?.hasAuras) updateAllTokens(arg.parent);
		else updateToken(arg);
		// console.log('updateToken', arg);
	});

	Hooks.on<Hooks.UpdateDocument<MeasuredTemplateConstructor>>(
		'updateMeasuredTemplate',
		(arg: MeasuredTemplateDocument) => {
			updateAllTokens(arg.parent);
			// console.log('updateMeasuredTemplate', arg);
		}
	);

	Hooks.on<Hooks.DeleteDocument<TokenConstructor>>('deleteToken', (arg: TokenDocument) => {
		if (arg.actor?.hasAuras) updateAllTokens(arg.parent);
		// console.log('deleteToken', arg);
	});

	Hooks.on<Hooks.DeleteDocument<MeasuredTemplateConstructor>>(
		'deleteMeasuredTemplate',
		(arg: MeasuredTemplateDocument) => {
			updateAllTokens(arg.parent);
			// console.log('deleteMeasuredTemplate', arg);
		}
	);

	Hooks.on<Hooks.CreateDocument<TokenConstructor>>('createToken', (arg: TokenDocument) => {
		if (arg.actor?.hasAuras) updateAllTokens(arg.parent);
		else updateToken(arg);
		// console.log('createMeasuredToken', arg);
	});
	Hooks.on<Hooks.CreateDocument<MeasuredTemplateConstructor>>(
		'createMeasuredTemplate',
		(arg: MeasuredTemplateDocument) => {
			updateAllTokens(arg.parent);
			// console.log('createMeasuredTemplate', arg);
		}
	);
	Hooks.on('canvasInit', () => {
		if (canvas?.scene) {
			updateAllTokens(canvas.scene);
		}
	});
	Hooks.on('deleteActiveEffect', (activeEffect) => {
		if (canvas?.scene && activeEffect.flags.mashup?.auras?.length) {
			updateAllTokens(canvas.scene);
		}
	});
	Hooks.on('updateActiveEffect', (activeEffect) => {
		if (canvas?.scene && activeEffect.flags.mashup?.auras?.length) {
			updateAllTokens(canvas.scene);
		}
	});
	Hooks.on('createActiveEffect', (activeEffect) => {
		if (canvas?.scene && activeEffect.flags.mashup?.auras?.length) {
			updateAllTokens(canvas.scene);
		}
	});

	function updateAllTokens(scene: Scene | null) {
		scene?.tokens.contents.forEach((token) => {
			token.actor?.updateAuras();
		});
	}
	function updateToken(token: TokenDocument) {
		token.actor?.updateAuras();
	}
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Hooks {
		interface StaticCallbacks {
			createActiveEffect: (activeEffect: MashupActiveEffect, options: unknown, id: string) => void;
			updateActiveEffect: (activeEffect: MashupActiveEffect, updates: unknown, options: unknown, id: string) => void;
			deleteActiveEffect: (activeEffect: MashupActiveEffect, options: unknown, id: string) => void;
		}
	}
}
