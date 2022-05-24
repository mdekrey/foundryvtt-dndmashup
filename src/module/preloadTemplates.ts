import { uniq } from 'lodash/fp';
import {
	templatePathActorParts,
	templatePathActorSheet,
	templatePathItemParts,
	templatePathItemSheet,
} from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
	const templatePaths: string[] = uniq([
		// Add paths to "systems/foundryvtt-dndmashup/templates"
		templatePathActorSheet('pc'),
		templatePathItemSheet('race'),
		templatePathItemSheet('class'),
		templatePathItemSheet('equipment'),

		...Object.values(templatePathActorParts),
		...Object.values(templatePathItemParts),
	]);

	return loadTemplates(templatePaths);
}
