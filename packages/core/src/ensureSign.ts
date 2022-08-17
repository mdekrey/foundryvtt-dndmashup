export function ensureSign(mod: number | string) {
	if (typeof mod === 'number') {
		const result = mod.toFixed(0);
		return result.startsWith('-') ? result : `+${result}`;
	} else if (mod.startsWith('-') || mod.startsWith('+')) {
		return mod;
	} else {
		return `+${mod}`;
	}
}
