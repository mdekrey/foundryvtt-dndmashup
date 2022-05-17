export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = [
		// Add paths to "systems/foundryvtt-dndmashup/templates"
	];

	return loadTemplates(templatePaths);
}
