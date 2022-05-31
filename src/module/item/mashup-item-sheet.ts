import { renderReact, Root } from 'src/components/sheet';
// import { attachBonusSheet, getBonusesContext } from '../bonuses';
// import { MashupItem } from './mashup-item';
import { ItemSheetJsx } from './templates/sheet';
// import { templatePathItemSheet, templatePathItemParts } from './templates/template-paths';

// type ItemHandlebarsContext = Awaited<ReturnType<ItemSheet['getData']>> & {
// 	rollData: object;
// 	itemData: DataConfig['Item']['data'];
// 	templates: Record<string, () => string>;
// 	bonuses: ReturnType<typeof getBonusesContext>;
// };

export class MashupItemSheet extends ItemSheet {
	root: Root | null = null;
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [],
			width: 585,
			height: 420,
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
		[this.form, this.root, returnValue] = renderReact(this, ItemSheetJsx);
		return returnValue;
	}

	protected override _replaceHTML(element: JQuery<HTMLElement>): void {
		if (!element.length) return;

		if (this.popOut) {
			element.find('.window-title').text(this.title);
		}
	}
}
