import { MashupItem } from './mashup-item';
import { itemMappings } from './subtypes';
import { PossibleItemType } from './types';
import { ClassSheet } from './subtypes/class/ClassSheet';
import { EquipmentSheet } from './subtypes/equipment/EquipmentSheet';
import { RaceSheet } from './subtypes/race/RaceSheet';
import { FeatureSheet } from './subtypes/feature/FeatureSheet';
import { ReactSheetMixin } from 'src/components/sheet/react-sheet-mixin';

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

export class MashupItemSheet extends ReactSheetMixin<typeof ItemSheet>(ItemSheet) {
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

	protected override _getJsx(): JSX.Element {
		return <ItemSheetJsx sheet={this} />;
	}
}
