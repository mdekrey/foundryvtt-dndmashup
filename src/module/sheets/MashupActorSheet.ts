import { MashupActor } from '../actor/mashup-actor';
import { templatePath } from '../constants';

export class MashupActorSheet extends ActorSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes added to parent element of template
			classes: [],
			template: `${templatePath}/actor/sheet.html`,
			width: 780,
			height: 600,
			tabs: [{ navSelector: `nav[data-group='primary']`, contentSelector: 'section', initial: 'description' }],
		});
	}

	override get template() {
		return `${templatePath}/actor/${this.actor.data.type}-sheet.html`;
	}

	override async getData() {
		// Handlebars context doesn't use types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const context = (await super.getData()) as any;

		const actorData: MashupActor = context.actor;

		context.data = actorData.data.data;

		// Add roll data for TinyMCE editors.
		context.rollData = context.actor.getRollData();

		console.log(context);

		return context;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		// oof, jquery.
	}
}
