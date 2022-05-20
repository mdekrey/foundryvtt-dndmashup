import { MashupActor } from './mashup-actor';
import { templatePathActorParts, templatePathActorSheet } from '../constants';

type CharacterSheetHandlebarsContext = Awaited<ReturnType<ActorSheet['getData']>> & {
	rollData: object;
	actorData: DataConfig['Actor']['data'];
};

export class MashupActorSheet extends ActorSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes added to parent element of template
			classes: [],
			width: 844,
			height: 915,
			tabs: [
				{
					navSelector: `nav[data-group='primary']`,
					contentSelector: 'section[data-tab-section]',
					initial: 'description',
				},
			],
		});
	}

	override get template() {
		return templatePathActorSheet(this.actor.data._source.type);
	}

	override async getData() {
		console.log('getData');
		const context = await super.getData();

		const actorData: MashupActor = context.actor;

		const result: CharacterSheetHandlebarsContext = mergeObject(context, {
			actorData: actorData.data.data,

			// Add roll data for TinyMCE editors.
			rollData: actorData.getRollData(),

			templates: Object.fromEntries(Object.entries(templatePathActorParts).map(([k, v]) => [k, () => v])),
		});

		console.log(result);

		return result;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		// oof, jquery.
	}
}
