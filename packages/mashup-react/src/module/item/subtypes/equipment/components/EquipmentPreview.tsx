// import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import classNames from 'classnames';
import { cardRowFormat, FlavorText, RulesText } from '@foundryvtt-dndmashup/components';
import { oxfordComma, pipeJsx } from '@foundryvtt-dndmashup/core';
import { EquipmentDocument } from '../dataSourceData';
import { itemSlots } from '../item-slots';
import { bonusToText, DynamicListTarget, dynamicListTargetNames } from '@foundryvtt-dndmashup/mashup-rules';
import { groupBy } from 'lodash/fp';

export function EquipmentPreview({ item, simple }: { item: EquipmentDocument; simple?: boolean }) {
	const { name, data: itemData } = item.data;
	// const applications = useApplicationDispatcher();
	const { statsPreview: StatsPreview } = itemSlots[itemData.itemSlot];
	const flavorText = itemData.description.text ? (
		<FlavorText dangerouslySetInnerHTML={{ __html: itemData.description.text }} />
	) : null;

	return (
		<section className={classNames('bg-white', { 'cursor-pointer': simple })} onClick={simple ? onDetails : undefined}>
			<header
				className={classNames(
					'bg-orange-dark',
					'font-header text-white',
					'flex justify-between items-baseline px-2 pt-0.5'
				)}>
				<span className="text-lg leading-none py-1 font-bold">{name}</span>
			</header>
			{pipeJsx(
				simple ? (
					flavorText ?? <></>
				) : (
					<>
						{flavorText}
						<div>
							<StatsPreview equipmentProperties={item.data.data.equipmentProperties as never} />
						</div>
						{item.data.data.grantedBonuses.map(bonusToText).map((text) => (
							<RulesText label="Bonus" key={text}>
								{text}
							</RulesText>
						))}
						{Object.entries(groupBy((e) => e.target, item.data.data.dynamicList)).map(([target, entries]) => (
							<RulesText label={dynamicListTargetNames[target as DynamicListTarget].label} key={target}>
								{oxfordComma(entries.map((e) => e.entry))}
							</RulesText>
						))}
					</>
				),
				cardRowFormat
			)}
		</section>
	);

	function onDetails() {
		// applications.launchApplication('equipmentDetails', { item });
	}
}
