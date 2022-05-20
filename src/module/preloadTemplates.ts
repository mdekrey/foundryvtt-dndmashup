import {
	templatePath,
	templatePathActorAbilities,
	templatePathActorDetails,
	templatePathActorInventory,
	templatePathActorPc,
	templatePathActorPowers,
	templatePathActorFeatures,
	templatePathActorFeats,
	templatePathActorEffects,
} from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = [
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorPc,
		`${templatePath}/actor/sheet.html`,
		templatePathActorAbilities,
		templatePathActorDetails,
		templatePathActorInventory,
		templatePathActorPowers,
		templatePathActorFeatures,
		templatePathActorFeats,
		templatePathActorEffects,
	];

	return loadTemplates(templatePaths);
}
