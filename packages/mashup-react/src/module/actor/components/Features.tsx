import { isFeature } from '../../item/subtypes/feature/isFeature';
import { ItemTable, useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { PossibleItemSourceData } from '../../item/item-data-types-template';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureDocument } from '../../item/subtypes/feature/dataSourceData';
import { DynamicList, DynamicListEntry, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { Stateful } from '@foundryvtt-dndmashup/core';
import { ActiveEffectDocument } from '../../active-effect';
import { ImageButton } from '@foundryvtt-dndmashup/components';
import { ActorDocument } from '../documentType';

const features: {
	key: React.Key;
	label: string;
	filter: (item: SimpleDocument<PossibleItemSourceData>) => boolean;
	header?: () => React.ReactNode;
	body?: (item: SimpleDocument<PossibleItemSourceData>) => React.ReactNode;
}[] = [
	{
		key: 'character-details',
		label: 'Name',
		filter: (item) =>
			item.type === 'class' || item.type === 'race' || item.type === 'paragonPath' || item.type === 'epicDestiny',
	},
	{
		key: 'race-feature',
		label: 'Racial Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'race-feature',
		header: () => <FeatureHeader />,
		body: (item) => <FeatureBody item={item as FeatureDocument} />,
	},
	{
		key: 'class-feature',
		label: 'Class Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'class-feature',
		header: () => <FeatureHeader />,
		body: (item) => <FeatureBody item={item as FeatureDocument} />,
	},
	{
		key: 'paragon-feature',
		label: 'Paragon Path Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'paragon-feature',
		header: () => <FeatureHeader />,
		body: (item) => <FeatureBody item={item as FeatureDocument} />,
	},
	{
		key: 'epic-feature',
		label: 'Epic Destiny Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'epic-feature',
		header: () => <FeatureHeader />,
		body: (item) => <FeatureBody item={item as FeatureDocument} />,
	},
	{
		key: 'feats',
		label: 'Feat',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'feat',
		header: () => <FeatureHeader />,
		body: (item) => <FeatureBody item={item as FeatureDocument} />,
	},
];

export function Features({
	actor,
	effects,
	items,
	bonuses,
	dynamicList,
}: {
	actor: ActorDocument;
	effects: ActiveEffectDocument[];
	items: SimpleDocument<PossibleItemSourceData>[];
	bonuses: Stateful<FeatureBonus[]>;
	dynamicList: Stateful<DynamicListEntry[]>;
}) {
	const apps = useApplicationDispatcher();
	const nonEquipment = items.filter(
		(i) => i.type !== 'equipment' && i.type !== 'power' && (!isFeature(i) || i.data.data.featureType !== 'feat')
	);
	const groups = features
		.map(({ filter, ...others }) => ({
			...others,
			items: items.filter(filter),
		}))
		.filter(({ items }) => items.length > 0);
	const other = nonEquipment.filter((item) => !features.some(({ filter }) => filter(item)));
	return (
		<>
			{effects.length > 0 ? (
				<ItemTable
					items={effects}
					title="Effects"
					header={() => <th className="w-7" />}
					body={(item) => (
						<td>
							{item.data.flags.mashup?.effectDuration?.durationType === 'saveEnds' ? (
								<ImageButton
									className="w-7 h-7"
									title="Roll Saving Throw"
									src="/icons/svg/d20-black.svg"
									onClick={onSave(item)}
								/>
							) : null}
						</td>
					)}
				/>
			) : null}
			{groups.map(({ key, label, items, header, body }) => (
				<ItemTable key={key} items={items} title={label} header={header} body={body} />
			))}
			{other.length ? <ItemTable items={other} title="Other" /> : null}
			<DynamicList dynamicList={dynamicList} />
		</>
	);

	function onSave(item: ActiveEffectDocument) {
		return async () => {
			const { result: resultPromise } = await apps.launchApplication('diceRoll', {
				actor,
				baseDice: 'd20',
				rollType: 'saving-throw',
				allowToolSelection: false,
				source: actor,
				sendToChat: true,
				title: `Saving Throw vs. ${item.name}`,
				flavor: `... makes a saving throw vs. ${item.name}`,
			});
			const result = await resultPromise;
			if (result >= 10) {
				item.delete();
			}
		};
	}
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: FeatureDocument }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
