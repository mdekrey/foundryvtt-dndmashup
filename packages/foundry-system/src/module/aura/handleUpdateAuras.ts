import { isGame } from '../../core/foundry';
import { MashupActor } from '../actor/mashup-actor';

type TokenConstructor = ConstructorParameters<ConstructorOf<TokenDocument>>[0];
type MeasuredTemplateConstructor = ConstructorParameters<ConstructorOf<MeasuredTemplateDocument>>[0];

export function handleUpdateAuras() {
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
		if ((arg.actor?.allAuras.length ?? 0) > 0) updateAllTokens(arg.parent);
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
		if ((arg.actor?.allAuras.length ?? 0) > 0) updateAllTokens(arg.parent);
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
		if ((arg.actor?.allAuras.length ?? 0) > 0) updateAllTokens(arg.parent);
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

	function updateAllTokens(scene: Scene | null) {
		scene?.tokens.contents.forEach((token) => {
			token.actor?.prepareDerivedData();
		});
	}
	function updateToken(token: TokenDocument) {
		token.actor?.prepareDerivedData();
	}
}
