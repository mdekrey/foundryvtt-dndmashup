import { templatePath, templatePathActorParts, templatePathActorPc } from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = [
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorPc,
		`${templatePath}/actor/sheet.html`,

		...Object.values(templatePathActorParts),
	];

	return loadTemplates(templatePaths);
}
