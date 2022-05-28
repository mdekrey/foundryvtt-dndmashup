import { templatePathActorSheet } from './templates/template-paths';
import { ActorSheetJsxDemo } from './sheet';
import { createRoot, Root } from 'react-dom/client';

export class MashupActorSheet extends ActorSheet {
	private root: Root | null = null;
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

	protected override async _renderInner(context: ActorSheet.Data<ActorSheet.Options>): Promise<JQuery<HTMLElement>> {
		if (!this.root || !this.form) {
			const result = $(`<form class="${context.cssClass} foundry-reset dndmashup" autocomplete="off"></form>`);
			this.form = result[0];
			this.root = createRoot(this.form);
		}
		this.root.render(ActorSheetJsxDemo({ sheet: this }));
		return $(this.form);
	}
}
