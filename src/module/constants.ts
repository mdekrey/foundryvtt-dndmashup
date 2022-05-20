export const systemName = 'foundryvtt-dndmashup';
export const rootPath = `systems/${systemName}` as const;
export const templatePath = `systems/${systemName}/templates` as const;
export const templatePathActorSheet = (type: SourceConfig['Actor']['type']) =>
	`${templatePath}/actor/${type}-sheet.html` as const;

export const templatePathActorParts = {
	header: `${templatePath}/actor/parts/header.html` as const,

	hitPoints: `${templatePath}/actor/parts/hitPoints.html` as const,
	defenses: `${templatePath}/actor/parts/defenses.html` as const,
	healingSurges: `${templatePath}/actor/parts/healingSurges.html` as const,
	actionPoints: `${templatePath}/actor/parts/actionPoints.html` as const,

	abilities: `${templatePath}/actor/parts/abilities.html` as const,
	details: `${templatePath}/actor/parts/details.html` as const,
	inventory: `${templatePath}/actor/parts/inventory.html` as const,
	powers: `${templatePath}/actor/parts/powers.html` as const,
	features: `${templatePath}/actor/parts/features.html` as const,
	feats: `${templatePath}/actor/parts/feats.html` as const,
	effects: `${templatePath}/actor/parts/effects.html` as const,
};

export const templatePathItemSheet = (type: SourceConfig['Item']['type']) =>
	`${templatePath}/item/${type}-sheet.html` as const;
