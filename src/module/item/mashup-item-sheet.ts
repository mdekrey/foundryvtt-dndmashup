import { attachBonusSheet, getBonusesContext } from '../bonuses';
import { templatePath, templatePathItemParts } from '../constants';
import { MashupItem } from './mashup-item';

type ItemHandlebarsContext = Awaited<ReturnType<ItemSheet['getData']>> & {
	rollData: object;
	itemData: DataConfig['Item']['data'];
	templates: Record<string, () => string>;
	bonuses: ReturnType<typeof getBonusesContext>;
};

export class MashupItemSheet extends ItemSheet {
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

	override get template() {
		return `${templatePath}/item/${this.item.data.type}-sheet.html`;
	}

	override async getData() {
		const context = await super.getData();

		const itemData: MashupItem = context.item;

		const result: ItemHandlebarsContext = mergeObject(context, {
			itemData: itemData.data.data,

			// Add roll data for TinyMCE editors.
			rollData: itemData.getRollData(),

			templates: Object.fromEntries(Object.entries(templatePathItemParts).map(([k, v]) => [k, () => v as never])),
			grantedBonuses: foundry.utils.deepClone(itemData.data.data.grantedBonuses),
			bonuses: getBonusesContext(),

			...context.item.subItemFunctions.sheetData(context.item.data),

			json: JSON.stringify(context.item.data._source, undefined, 4),
		});

		return result;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		attachBonusSheet(html, this, {
			grantedBonuses: () => this.item.data.data.grantedBonuses,
		});

		html.find('select[value]').each(function () {
			const target = $(this);
			const value = target.attr('value');
			target.find(`option[value=${value}]`).attr('selected', 'selected');
		});
	}

	// updateData is manually passed data to `this.submit`
	// fd gets the actual form data
	// returns an object to be merged into the _source object
	protected override _getSubmitData(updateData?: object | null): Record<string, unknown> {
		const fd = new FormDataExtended(this.form as HTMLFormElement, { editors: this.editors });
		let data = foundry.utils.expandObject(fd.toObject());
		if (updateData) foundry.utils.mergeObject(data, updateData);
		// the inner data property is partial - this ensures it's pre-populated for the sheetDataConvert function
		data = foundry.utils.mergeObject({ data: this.item.data._source.data }, data);
		console.log({ updateData, data });

		if (this.item.subItemFunctions.sheetDataConvert) return this.item.subItemFunctions.sheetDataConvert(data);
		data.data.grantedBonuses = Array.from(Object.values(data.grantedBonuses || {}));
		delete data.grantedBonuses;
		return data;
	}
}
