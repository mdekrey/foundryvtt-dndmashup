type DispositionFilter = (auraOwner: number, comparison: number) => boolean;

export type DispositionType = 'ally' | 'enemy' | 'not allies' | 'not enemies' | 'hostile' | 'friendly';

const dispositionFilters: Record<DispositionType, DispositionFilter> = {
	ally: (auraOwner, comparison) => auraOwner === comparison,
	enemy: (auraOwner, comparison) => auraOwner === -comparison,
	'not allies': (auraOwner, comparison) => auraOwner !== comparison,
	'not enemies': (auraOwner, comparison) => auraOwner !== -comparison,
	hostile: (auraOwner, comparison) => comparison === -1,
	friendly: (auraOwner, comparison) => comparison === 1,
};

export function filterDisposition(filter: DispositionType | null, auraOwner: number, comparison: number) {
	if (!filter) return true;
	return dispositionFilters[filter](auraOwner, comparison);
}
