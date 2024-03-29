import { ActorSheetJsx } from './templates/sheet';
import { ReactApplicationMixin } from '../../core/react/react-application-mixin';
import { ItemDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { MashupItemBase } from '../item/mashup-item';
import { SkillEntry } from '@foundryvtt-dndmashup/mashup-react';
import { getImportExportButtons } from '../../core/foundry/getImportExportButtons';
import { isActorType } from './templates/isActorType';
import { DropData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document';
import { getCharacterSheet } from '../../server/get-character-sheet';
import { SpecificActor } from './mashup-actor';

export class MashupActorSheet extends ReactApplicationMixin(ActorSheet) {
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

	protected override _getHeaderButtons(): Application.HeaderButton[] {
		const result = super._getHeaderButtons();
		result.unshift(...getImportExportButtons(this.actor));

		if (this.actor.type === 'pc')
			result.unshift({
				label: 'Character Sheet',
				class: 'actor-export-sheet',
				icon: 'fas fa-address-card',
				onclick: () => getCharacterSheet(this.actor as SpecificActor<'pc'>),
			});
		return result;
	}

	protected override _getJsx(): JSX.Element {
		return <ActorSheetJsx sheet={this} />;
	}

	protected override async _onDropItem(event: DragEvent, data: DropData<MashupItemBase>) {
		if (!this.actor.isOwner) return false;
		const item = await MashupItemBase.fromDropData(data);
		if (!item) return;
		const itemData = item.toObject();

		// Handle item sorting within the same Actor
		if (this.actor.uuid === item.parent?.uuid) return this._onSortItem(event, itemData);
		if (item.parent && item.parent?.isOwner && item.type === 'equipment') item.delete(); // move rather than copy

		// Create the owned item
		return this._onDropItemCreate(itemData);
	}

	protected override async _onDropItemCreate(itemData: ItemDataSource | ItemDataSource[]): Promise<MashupItemBase[]> {
		itemData = itemData instanceof Array ? itemData : [itemData];

		const skills = itemData.filter((i) => i.type === 'skill');

		if (skills.length > 0 && isActorType(this.actor, 'pc')) {
			const data: Record<`data.skills`, SkillEntry[]> = {
				'data.skills': this.actor.system.skills ?? [],
			};
			for (const skill of skills) {
				if (this.actor.system.skills?.find((s) => s.name === skill.name) && skill.img && skill.name) {
					continue;
				}
				data['data.skills'].push({
					img: skill.img || '',
					name: skill.name,
					ranks: 0,
				});
			}
			await this.actor.update(data);
		}

		itemData = itemData.filter((i) => i.type !== 'skill');
		if (itemData.length) {
			return await super._onDropItemCreate(itemData);
		} else return [];
	}
}
