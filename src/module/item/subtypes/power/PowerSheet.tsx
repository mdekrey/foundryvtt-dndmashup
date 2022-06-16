import { Tabs } from 'src/components/tab-section';
import { MashupPower } from './config';
import { PowerEditor } from './components/PowerEditor';
import { useRef, useState } from 'react';

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
							<div />
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
