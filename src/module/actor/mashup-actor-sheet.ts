import { templatePathActorSheet } from './templates/template-paths';
import { ActorSheetJsxDemo } from './sheet';
import { renderReact, Root } from 'src/components/sheet';

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
		let returnValue: JQuery<HTMLElement>;
		[this.form, this.root, returnValue] = renderReact(this.form, this.root, context.cssClass, this, ActorSheetJsxDemo);
		return returnValue;
	}

	protected override _replaceHTML(element: JQuery<HTMLElement>): void {
		if (!element.length) return;

		if (this.popOut) {
			element.find('.window-title').text(this.title);
		}
	}
}
