import { templatePath } from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = [
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		`${templatePath}/actor/pc-sheet.html`,
		`${templatePath}/actor/sheet.html`,
		`${templatePath}/actor/_attributes.html`,
	];

	return loadTemplates(templatePaths);
}
