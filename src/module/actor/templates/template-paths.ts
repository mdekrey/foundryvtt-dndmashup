import { templatePathSharedParts } from 'src/module/bonuses/templates';
import { rootPath } from 'src/module/constants';

const templatePath = `${rootPath}/module/actor/templates` as const;
export const templatePathActorSheet = (type: SourceConfig['Actor']['type']) =>
	`${templatePath}/${type}-sheet.html` as const;

export const templatePathActorParts = {
	header: `${templatePath}/parts/header.html` as const,

	hitPoints: `${templatePath}/parts/hitPoints.html` as const,
	defenses: `${templatePath}/parts/defenses.html` as const,
	healingSurges: `${templatePath}/parts/healingSurges.html` as const,
	actionPoints: `${templatePath}/parts/actionPoints.html` as const,

	abilities: `${templatePath}/parts/abilities.html` as const,
	details: `${templatePath}/parts/details.html` as const,
	inventory: `${templatePath}/parts/inventory.html` as const,
	powers: `${templatePath}/parts/powers.html` as const,
	features: `${templatePath}/parts/features.html` as const,
	feats: `${templatePath}/parts/feats.html` as const,
	effects: `${templatePath}/parts/effects.html` as const,

	...templatePathSharedParts,
};
