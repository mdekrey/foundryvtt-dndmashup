import { renderReact, Root } from 'src/components/sheet';
import { MashupItem } from './mashup-item';
import { itemMappings } from './subtypes';
import { PossibleItemType } from './types';
import { ClassSheet } from './subtypes/class/ClassSheet';
import { EquipmentSheet } from './subtypes/equipment/EquipmentSheet';
import { RaceSheet } from './subtypes/race/RaceSheet';
import { FeatureSheet } from './subtypes/feature/FeatureSheet';

const sheets: { [K in PossibleItemType]: React.FC<{ item: InstanceType<typeof itemMappings[K]> }> } = {
	class: ClassSheet,
	race: RaceSheet,
	equipment: EquipmentSheet,
	feature: FeatureSheet,
};

function ItemSheetJsx({ sheet }: { sheet: MashupItemSheet }) {
	const item = sheet.item;
	const Sheet = sheets[item.type] as React.FC<{ item: MashupItem }>;

	return <Sheet item={item} />;
}

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
