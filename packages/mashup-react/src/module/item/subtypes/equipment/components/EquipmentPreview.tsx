// import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import classNames from 'classnames';
import { cardRowFormat, FlavorText, RulesText } from '@foundryvtt-dndmashup/components';
import { ensureSign, oxfordComma, pipeJsx } from '@foundryvtt-dndmashup/core';
import { EquipmentDocument } from '../dataSourceData';
import { itemSlots } from '../item-slots';
import {
	bonusToText,
	DynamicListTarget,
	dynamicListTargetNames,
	PoolBonusTarget,
} from '@foundryvtt-dndmashup/mashup-rules';
import { groupBy } from 'lodash/fp';
import { isEquipment } from '../isEquipment';
import { isPower, PowerPreview } from '../../power';

const poolBonusTargetText: Record<PoolBonusTarget, string> = {
	max: 'maximum uses',
	longRest: 'uses gained per long rest',
	shortRest: 'uses gained per short rest',
	perRest: 'allowed uses between short and long rests',
};

export function EquipmentPreview({ item, simple }: { item: EquipmentDocument; simple?: boolean }) {
	const { name, data: itemData } = item.data;
	// const applications = useApplicationDispatcher();
	const { statsPreview: StatsPreview } = itemSlots[itemData.itemSlot];
	const flavorText = itemData.description.text ? (
		<FlavorText dangerouslySetInnerHTML={{ __html: itemData.description.text }} />
	) : null;

	const equipmentContents = item.data.data.container
		? item.items.contents
				.filter(isEquipment)
				.map((eq) => eq.name)
				.filter((n): n is string => n !== null)
		: [];
	const powerContents = item.items.contents.filter(isPower);

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
						{Object.entries(groupBy((e) => e.name, item.data.data.grantedPoolBonuses ?? [])).map(
							([pool, poolBonuses], index) => (
								<RulesText label={pool} key={pool}>
									{poolBonuses
										.map((poolBonus) => `${ensureSign(poolBonus.amount)} to ${poolBonusTargetText[poolBonus.target]}.`)
										.join(' ')}
								</RulesText>
							)
						)}
						{item.data.data.container ? (
							<RulesText label="Contents">
								{equipmentContents.length ? oxfordComma(equipmentContents) : 'None'}
							</RulesText>
						) : null}
					</>
				),
				cardRowFormat
			)}
			<div className="ml-4">
				{powerContents.map((power, index) => (
					<PowerPreview item={power} key={item.id ?? index} />
				))}
			</div>
		</section>
	);

	function onDetails() {
		// TODO
		// applications.launchApplication('equipmentDetails', { item });
	}
}
