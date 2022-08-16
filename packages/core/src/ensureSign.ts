export function ensureSign(mod: number) {
	const result = mod.toFixed(0);
	return result.startsWith('-') ? result : `+${result}`;
}
