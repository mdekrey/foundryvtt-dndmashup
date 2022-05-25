import { MashupActor } from './mashup-actor';
import { templatePathActorParts, templatePathActorSheet } from './templates/template-paths';

type ActorHandlebarsContext = Awaited<ReturnType<ActorSheet['getData']>> & {
	actorData: DataConfig['Actor']['data'];
	rollData: object;

	templates: Record<string, () => string>;
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
		const context = await super.getData();

		const actorData: MashupActor = context.actor;

		const result: ActorHandlebarsContext = mergeObject(context, {
			actorData: actorData.data.data,
			// Add roll data for TinyMCE editors.
			rollData: actorData.getRollData(),

			templates: Object.fromEntries(Object.entries(templatePathActorParts).map(([k, v]) => [k, () => v])),
		});

		return result;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		html.find('[data-show-item]').on('click', (event) => {
			this.actor.items.find((item) => item.id === event.target.getAttribute('data-show-item'))?.sheet?.render(true);
		});
	}
}
