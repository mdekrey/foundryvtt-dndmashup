import { uniq } from 'lodash/fp';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = uniq([
		// Add paths to "systems/foundryvtt-dndmashup/templates"
	]);
	console.log('preloading...', templatePaths);

	return loadTemplates(templatePaths);
}
