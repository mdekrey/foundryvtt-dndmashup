import { Tabs } from '@foundryvtt-dndmashup/components';
import { PoolsEditor } from '@foundryvtt-dndmashup/mashup-rules';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import { PowerEditor } from './components/PowerEditor';
import { useRef, useState } from 'react';
import { PowerPreview } from './components/PowerPreview';
import { PowerDocument } from './dataSourceData';
import { grantedPoolsLens, usedPoolsLens } from './components/sheetLenses';
import { UsePoolsEditor } from './components/UsePoolsEditor';
import { FeaturesList } from '../../components/FeaturesList';

export function PowerSheet({ item }: { item: PowerDocument }) {
	const documentState = documentAsState(item, { deleteData: true });
	const isNew = useRef(item.data.data.flavorText === '' && item.data.data.effects.length === 0);
	const [activeTab, setActiveTab] = useState(isNew.current ? 'editor' : 'preview');

	return (
		<>
			{isNew.current ? (
				<PowerEditor itemState={documentState} />
			) : (
				<Tabs.Controlled activeTab={activeTab} setActiveTab={setActiveTab}>
					<Tabs.Nav>
						<Tabs.NavButton tabName="preview">Preview</Tabs.NavButton>
						<Tabs.NavButton tabName="editor">Editor</Tabs.NavButton>
						<Tabs.NavButton tabName="sub-powers">Sub-Powers</Tabs.NavButton>
						<Tabs.NavButton tabName="templates">Templates</Tabs.NavButton>
						<Tabs.NavButton tabName="pools">Resources</Tabs.NavButton>
					</Tabs.Nav>

					<section className="flex-grow">
						<Tabs.Tab tabName="preview">
							<PowerPreview item={item} />
						</Tabs.Tab>
						<Tabs.Tab tabName="editor">
							<PowerEditor itemState={documentState} />
						</Tabs.Tab>
						<Tabs.Tab tabName="sub-powers">
							<FeaturesList items={item.items.contents} />
						</Tabs.Tab>
						<Tabs.Tab tabName="templates">{/* <FeaturesList item={item} /> */}</Tabs.Tab>

						<Tabs.Tab tabName="pools">
							<UsePoolsEditor pools={usedPoolsLens.apply(documentState)} />
							<PoolsEditor pools={grantedPoolsLens.apply(documentState)} />
						</Tabs.Tab>
					</section>
				</Tabs.Controlled>
			)}
		</>
	);
}
