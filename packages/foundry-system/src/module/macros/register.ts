import { isGame } from '../../core/foundry';

export function registerHotbarDrop() {
	Hooks.on('hotbarDrop', (hotbar: Hotbar, data: unknown, slot: number) => {
		handleHotbarDrop(hotbar, data, slot);
		return false;
	});
}

async function handleHotbarDrop(hotbar: Hotbar, data: any, slot: number) {
	if (!isGame(game)) return;
	const macro = await createMacroFrom(hotbar, data);

	// Assign the macro to the hotbar
	if (!macro) return;
	return game.user?.assignHotbarMacro(macro, slot, { fromSlot: data.slot });
}

async function createMacroFrom(hotbar: Hotbar, data: any): Promise<Macro | null> {
	if (!isGame(game)) return null;

	if (typeof data === 'object' && data) {
		const target = 'uuid' in data ? await fromUuid(data.uuid) : undefined;

		if (data.type === 'Macro') {
			return (
				(data.id && game.macros?.has(data.id) ? game.macros.get(data.id) : ((await Macro.create(data)) as Macro)) ??
				null
			);
		} else if (data.action === 'use-power') {
			if (target)
				return (await Macro.create({
					name: `${game.i18n.localize('Use')} ${data.name ?? target?.name}`,
					type: CONST.MACRO_TYPES.SCRIPT,
					img: data.img ?? (target as any)?.img ?? 'icons/svg/book.svg',
					command: `MashupHotbar.usePower("${data.name}")`,
				})) as Macro;
			else
				return (await Macro.create({
					name: `${game.i18n.localize('Use')} ${data.name}`,
					type: CONST.MACRO_TYPES.SCRIPT,
					img: data.img ?? 'icons/svg/book.svg',
					command: `MashupHotbar.useCommonAction("${data.name}")`,
				})) as Macro;
		} else if (target) {
			console.warn('unsure what to do with macro for: ', target);
			return (await Macro.create({
				name: `${game.i18n.localize('Display')} ${data.name ?? target.name}`,
				type: CONST.MACRO_TYPES.SCRIPT,
				img: data.img ?? (target as any).img ?? 'icons/svg/book.svg',
				command: `Hotbar.toggleDocumentSheet("${data.uuid}")`,
			})) as Macro;
		}
	}

	return null;
}
