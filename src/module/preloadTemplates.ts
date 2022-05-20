import { templatePath, templatePathActorParts, templatePathActorSheet } from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = [
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorSheet('pc'),
		`${templatePath}/actor/sheet.html`,

		...Object.values(templatePathActorParts),
	];

	return loadTemplates(templatePaths);
}
