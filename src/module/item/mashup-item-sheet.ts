import { templatePath, templatePathItemParts } from '../constants';
import { MashupItem } from './mashup-item';

type ItemHandlebarsContext = Awaited<ReturnType<ItemSheet['getData']>> & {
	rollData: object;
	itemData: DataConfig['Item']['data'];
	templates: Record<string, () => string>;
};

export class MashupItemSheet extends ItemSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [],
			width: 585,
			height: 420,
		});
	}

	override get template() {
		return `${templatePath}/item/${this.item.data.type}-sheet.html`;
	}

	override async getData() {
		console.log('getData');
		const context = await super.getData();

		const itemData: MashupItem = context.item;

		const result: ItemHandlebarsContext = mergeObject(context, {
			itemData: itemData.data.data,

			// Add roll data for TinyMCE editors.
			rollData: itemData.getRollData(),

			templates: Object.fromEntries(Object.entries(templatePathItemParts).map(([k, v]) => [k, () => v as never])),
		});

		console.log(result);

		return result;
	}
}
