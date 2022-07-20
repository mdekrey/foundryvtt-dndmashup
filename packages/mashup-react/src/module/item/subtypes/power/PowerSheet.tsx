import { Tabs } from '@foundryvtt-dndmashup/components';
import { PowerEditor } from './components/PowerEditor';
import { useRef, useState } from 'react';
import { PowerPreview } from './components/PowerPreview';
import { PowerDocument } from './dataSourceData';

export function PowerSheet({ item }: { item: PowerDocument }) {
	const isNew = useRef(item.data.data.flavorText === '' && item.data.data.effect.effects.length === 0);
	const [activeTab, setActiveTab] = useState(isNew.current ? 'editor' : 'preview');

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
