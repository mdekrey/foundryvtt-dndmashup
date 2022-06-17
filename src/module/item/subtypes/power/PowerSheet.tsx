import { Tabs } from 'src/components/tab-section';
import { MashupPower } from './config';
import { PowerEditor } from './components/PowerEditor';
import { useRef, useState } from 'react';
import classNames from 'classnames';

export function PowerSheet({ item }: { item: MashupPower }) {
	const isNew = useRef(item.data.data.flavorText === '' && item.data.data.effect.effects.length === 0);
	const [activeTab, setActiveTab] = useState(isNew ? 'editor' : 'preview');

	return (
		<>
			{isNew.current ? (
				<PowerEditor item={item} />
			) : (
				<Tabs.Controlled activeTab={activeTab} setActiveTab={setActiveTab}>
					<Tabs.Nav>
						<Tabs.NavButton tabName="preview">Preview</Tabs.NavButton>
						<Tabs.NavButton tabName="editor">Editor</Tabs.NavButton>
						<Tabs.NavButton tabName="templates">Templates</Tabs.NavButton>
					</Tabs.Nav>

					<section className="flex-grow">
						<Tabs.Tab tabName="preview">
							<PowerPreview item={item} />
						</Tabs.Tab>
						<Tabs.Tab tabName="editor">
							<PowerEditor item={item} />
						</Tabs.Tab>
						<Tabs.Tab tabName="templates">{/* <FeaturesList item={item} /> */}</Tabs.Tab>
					</section>
				</Tabs.Controlled>
			)}
		</>
	);
}

export function PowerPreview({ item }: { item: MashupPower }) {
	const { name, data: itemData } = item.data;
	return (
		<section>
			<header
				className={classNames(
					{
						'bg-green-dark': itemData.usage === 'at-will',
						'bg-red-dark': itemData.usage === 'encounter',
						'bg-gray-dark': itemData.usage === 'daily',
						'bg-orange-dark': itemData.usage === 'item',
						'bg-blue-dark':
							itemData.usage !== 'at-will' &&
							itemData.usage !== 'encounter' &&
							itemData.usage !== 'daily' &&
							itemData.usage !== 'item',
					},
					'font-header text-white',
					'flex justify-between items-baseline px-2 pt-0.5'
				)}>
				<span className="text-lg leading-none py-1 font-bold">{name}</span>
				<span className="text-sm leading-tight">{itemData.type}</span>
			</header>
		</section>
	);
}
