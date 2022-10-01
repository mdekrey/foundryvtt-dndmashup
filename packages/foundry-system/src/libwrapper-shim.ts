/* eslint-disable eqeqeq,no-eval,@typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-types,@typescript-eslint/no-namespace */
// SPDX-License-Identifier: MIT
// Copyright © 2021 fvtt-lib-wrapper Rui Pinheiro
// Source: https://github.com/ruipin/fvtt-lib-wrapper/blob/e2864f7c1bfda871e57378899d4074b5328f0784/shim/shim.js

// A shim for the libWrapper library
export let libWrapper: typeof LibWrapperShim;

export const VERSIONS = [1, 12, 2];
export const TGT_SPLIT_RE = new RegExp('([^.[]+|\\[(\'([^\'\\\\]|\\\\.)+?\'|"([^"\\\\]|\\\\.)+?")\\])', 'g');
export const TGT_CLEANUP_RE = new RegExp('(^\\[\'|\'\\]$|^\\["|"\\]$)', 'g');

declare global {
	export type LibWrapperWrapperFunction<T extends (...args: any[]) => any> = (
		original: T,
		...params: Parameters<T>
	) => ReturnType<T>;
}

class LibWrapperShim {
	static get is_fallback() {
		return true;
	}

	static get WRAPPER() {
		return 'WRAPPER';
	}
	static get MIXED() {
		return 'MIXED';
	}
	static get OVERRIDE() {
		return 'OVERRIDE';
	}

	static register<T extends (...args: any[]) => any>(
		package_id: string,
		target: string,
		fn: LibWrapperWrapperFunction<T>,
		type = 'MIXED',
		{ chain = undefined, bind = [] } = {}
	) {
		const is_setter = target.endsWith('#set');
		target = !is_setter ? target : target.slice(0, -4);
		const split = target.match(TGT_SPLIT_RE)!.map((x) => x.replace(/\\(.)/g, '$1').replace(TGT_CLEANUP_RE, ''));
		const root_nm = split.splice(0, 1)[0];

		let obj, fn_name: string;
		if (split.length == 0) {
			obj = globalThis;
			fn_name = root_nm;
		} else {
			const _eval = eval;
			fn_name = split.pop()!;
			obj = split.reduce((x, y) => x[y], (globalThis as any)[root_nm] ?? _eval(root_nm));
		}

		let iObj = obj;
		let descriptor = null;
		while (iObj) {
			descriptor = Object.getOwnPropertyDescriptor(iObj, fn_name);
			if (descriptor) break;
			iObj = Object.getPrototypeOf(iObj);
		}
		if (!descriptor || descriptor?.configurable === false)
			throw new Error(
				`libWrapper Shim: '${target}' does not exist, could not be found, or has a non-configurable descriptor.`
			);

		let original: Function | null | undefined = null;
		const wrapper =
			chain ?? (type.toUpperCase?.() != 'OVERRIDE' && Number(type) != 3)
				? function (this: any, ...args: any[]) {
						return (fn as Function).call(this, (original as Function).bind(this), ...bind, ...args);
				  }
				: function (this: any, ...args: any[]) {
						return (fn as Function).call(this, ...bind, ...args);
				  };
		if (!is_setter) {
			if (descriptor.value) {
				original = descriptor.value;
				descriptor.value = wrapper;
			} else {
				original = descriptor.get;
				descriptor.get = wrapper;
			}
		} else {
			if (!descriptor.set) throw new Error(`libWrapper Shim: '${target}' does not have a setter`);
			original = descriptor.set;
			descriptor.set = wrapper;
		}

		descriptor.configurable = true;
		Object.defineProperty(obj, fn_name, descriptor);
	}
}

// Main shim code
Hooks.once('init', () => {
	// Check if the real module is already loaded - if so, use it
	if (globalThis.libWrapper && !(globalThis.libWrapper.is_fallback ?? true)) {
		libWrapper = globalThis.libWrapper;
		return;
	}

	// Fallback implementation
	libWrapper = LibWrapperShim;

	//************** USER CUSTOMIZABLE:
	// Set up the ready hook that shows the "libWrapper not installed" warning dialog. Remove if undesired.
	{
		//************** USER CUSTOMIZABLE:
		// Package ID & Package Title - by default attempts to auto-detect, but you might want to hardcode your package ID and title here to avoid potential auto-detect issues
		const [PACKAGE_ID, PACKAGE_TITLE] = (() => {
			const match = (import.meta.url ?? Error().stack)?.match(/\/(worlds|systems|modules)\/(.+)(?=\/)/i);
			if (match?.length !== 3) return [null, null];
			const dirs = match[2].split('/');
			if (match[1] === 'worlds')
				return dirs.find((n) => n && (game as Game).world.id === n)
					? [(game as Game).world.id, (game as Game).world.data.title]
					: [null, null];
			if (match[1] === 'systems')
				return dirs.find((n) => n && (game as Game).system.id === n)
					? [(game as Game).system.id, (game as any).system.title ?? (game as any).system.data.title]
					: [null, null];
			const id = dirs.find((n) => n && (game as Game).modules.has(n))!;
			const mdl = (game as Game).modules.get(id) as any;
			return [id, mdl?.title ?? mdl?.data?.title];
		})();

		if (!PACKAGE_ID || !PACKAGE_TITLE) {
			console.error(
				'libWrapper Shim: Could not auto-detect package ID and/or title. The libWrapper fallback warning dialog will be disabled.'
			);
			return;
		}

		Hooks.once('ready', () => {
			//************** USER CUSTOMIZABLE:
			// Title and message for the dialog shown when the real libWrapper is not installed.
			const FALLBACK_MESSAGE_TITLE = PACKAGE_TITLE;
			const FALLBACK_MESSAGE = `
				<p><b>'${PACKAGE_TITLE}' depends on the 'libWrapper' module, which is not present.</b></p>
				<p>A fallback implementation will be used, which increases the chance of compatibility issues with other modules.</p>
				<small><p>'libWrapper' is a library which provides package developers with a simple way to modify core Foundry VTT code, while reducing the likelihood of conflict with other packages.</p>
				<p>You can install it from the "Add-on Modules" tab in the <a href="javascript:game.shutDown()">Foundry VTT Setup</a>, from the <a href="https://foundryvtt.com/packages/lib-wrapper">Foundry VTT package repository</a>, or from <a href="https://github.com/ruipin/fvtt-lib-wrapper/">libWrapper's Github page</a>.</p></small>
			`;

			// Settings key used for the "Don't remind me again" setting
			const DONT_REMIND_AGAIN_KEY = 'libwrapper-dont-remind-again';

			// Dialog code
			console.warn(`${PACKAGE_TITLE}: libWrapper not present, using fallback implementation.`);
			(game as Game).settings.register(PACKAGE_ID, DONT_REMIND_AGAIN_KEY, {
				name: '',
				default: false,
				type: Boolean,
				scope: 'world',
				config: false,
			});
			if ((game as Game).user!.isGM && !(game as Game).settings.get(PACKAGE_ID, DONT_REMIND_AGAIN_KEY)) {
				new Dialog({
					title: FALLBACK_MESSAGE_TITLE,
					content: FALLBACK_MESSAGE,
					buttons: {
						ok: { icon: '<i class="fas fa-check"></i>', label: 'Understood' },
						dont_remind: {
							icon: '<i class="fas fa-times"></i>',
							label: "Don't remind me again",
							callback: () => (game as Game).settings.set(PACKAGE_ID, DONT_REMIND_AGAIN_KEY, true),
						},
					},
				}).render(true);
			}
		});
	}
});

declare namespace globalThis {
	const libWrapper: typeof LibWrapperShim;
}
