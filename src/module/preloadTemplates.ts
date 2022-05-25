import { uniq } from 'lodash/fp';
import { templatePathActorParts, templatePathActorSheet } from './actor/templates/template-paths';
import {
	otherEquipmentDetails,
	templatePathEquipmentParts,
	templatePathItemParts,
	templatePathItemSheet,
} from './item/templates/template-paths';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = uniq([
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorSheet('pc'),
		templatePathItemSheet('race'),
		templatePathItemSheet('class'),
		templatePathItemSheet('equipment'),

		...Object.values(templatePathActorParts),
		...Object.values(templatePathItemParts),
		otherEquipmentDetails,
		...Object.values(templatePathEquipmentParts),
	]);
	console.log('preloading...', templatePaths);

	return loadTemplates(templatePaths);
}
