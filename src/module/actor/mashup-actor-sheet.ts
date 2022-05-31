import { ActorSheetJsx } from './templates/sheet';
import { renderReact, Root } from 'src/components/sheet';

export class MashupActorSheet extends ActorSheet {
	root: Root | null = null;
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes added to parent element of template
			classes: ['foobar'],
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

	protected override async _renderInner(): Promise<JQuery<HTMLElement>> {
		let returnValue: JQuery<HTMLElement>;
		[this.form, this.root, returnValue] = renderReact(this, ActorSheetJsx);
		return returnValue;
	}

	protected override _replaceHTML(element: JQuery<HTMLElement>): void {
		if (!element.length) return;

		if (this.popOut) {
			element.find('.window-title').text(this.title);
		}
	}

	override async close(options?: FormApplication.CloseOptions): Promise<void> {
		await super.close(options);
		this.form = null;
		this.root = null;
	}
}
