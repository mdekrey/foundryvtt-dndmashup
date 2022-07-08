import { FeatureBonus } from 'src/module/bonuses';
import { PossibleItemType } from '../../item-data-types-template';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData } from '../../types';
import { EquipmentData } from './dataSourceData';
import { ItemSlot } from './item-slots';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot> extends MashupItem<'equipment'> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data!: SpecificItemEquipmentData<TItemSlot> & EquipmentData<TItemSlot>;
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			// TODO: only if equipped and it requires an item slot
			...this.data.data.grantedBonuses,
		];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		// TODO - conly contain other equipment if it is a "container"
		return type === 'equipment' || type === 'power';
	}
}
