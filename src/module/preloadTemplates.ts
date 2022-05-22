import { uniq } from 'lodash/fp';
import { templatePath, templatePathActorParts, templatePathActorSheet, templatePathItemParts } from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = uniq([
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorSheet('pc'),
		`${templatePath}/actor/sheet.html`,

		...Object.values(templatePathActorParts),
		...Object.values(templatePathItemParts),
	]);

	return loadTemplates(templatePaths);
}
