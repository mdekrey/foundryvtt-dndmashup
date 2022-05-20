import { MashupActor } from '../actor/mashup-actor';
import {
	templatePath,
	templatePathActorAbilities,
	templatePathActorDetails,
	templatePathActorEffects,
	templatePathActorFeats,
	templatePathActorFeatures,
	templatePathActorInventory,
	templatePathActorPowers,
} from '../constants';

type CharacterSheetHandlebarsContext = Awaited<ReturnType<ActorSheet['getData']>> & {
	rollData: object;
	actorData: DataConfig['Actor']['data'];
};

export class MashupActorSheet extends ActorSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes added to parent element of template
			classes: [],
			template: `${templatePath}/actor/sheet.html`,
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
		return `${templatePath}/actor/${this.actor.data.type}-sheet.html`;
	}

	override async getData() {
		console.log('getData');
		const context = await super.getData();

		const actorData: MashupActor = context.actor;

		const result: CharacterSheetHandlebarsContext = mergeObject(context, {
			actorData: actorData.data.data,

			// Add roll data for TinyMCE editors.
			rollData: actorData.getRollData(),

			templates: {
				abilities: () => templatePathActorAbilities,
				details: () => templatePathActorDetails,
				inventory: () => templatePathActorInventory,
				powers: () => templatePathActorPowers,
				features: () => templatePathActorFeatures,
				feats: () => templatePathActorFeats,
				effects: () => templatePathActorEffects,
			},
		});

		console.log(result);

		return result;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		// oof, jquery.
	}
}
