import { ActorSheetJsx } from './templates/sheet';
import { ReactApplicationMixin } from '../../core/react/react-application-mixin';
import { ItemDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { MashupItemBase } from '../item/mashup-item';
import { SkillEntry } from '@foundryvtt-dndmashup/mashup-react';
import { getImportExportButtons } from '../../core/foundry/getImportExportButtons';

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
		return result;
	}

	protected override _getJsx(): JSX.Element {
		return <ActorSheetJsx sheet={this} />;
	}

	protected override async _onDropItemCreate(itemData: ItemDataSource | ItemDataSource[]): Promise<MashupItemBase[]> {
		itemData = itemData instanceof Array ? itemData : [itemData];

		const skills = itemData.filter((i) => i.type === 'skill');

		if (skills.length > 0 && this.actor.data.type === 'pc') {
			const data: Record<`data.skills`, SkillEntry[]> = {
				'data.skills': this.actor.data.data.skills ?? [],
			};
			for (const skill of skills) {
				if (this.actor.data.data.skills?.find((s) => s.name === skill.name) && skill.img && skill.name) {
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
