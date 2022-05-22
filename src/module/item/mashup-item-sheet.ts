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
			bonuses: getBonusesContext(),
		});

		return result;
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		attachBonusSheet(html, {
			'data.grantedBonuses': {
				get: () => this.item.data.data.grantedBonuses,
				update: async (mutator) => {
					await this.item.update({ data: { grantedBonuses: mutator(this.item.data.data.grantedBonuses) } });
				},
			},
		});

		html.find('select[value]').each(function () {
			const target = $(this);
			const value = target.attr('value');
			target.find(`option[value=${value}]`).attr('selected', 'selected');
		});
	}
}
