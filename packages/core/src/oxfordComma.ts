export function oxfordComma(parts: string[]) {
	if (parts.length < 3) return parts.join(' and ');
	return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}
