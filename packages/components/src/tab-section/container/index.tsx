import { useMemo, useState } from 'react';
import { TabContextProvider } from '../internals/context';
import { TabContext } from '../type';

export function Container({ defaultActiveTab, children }: { defaultActiveTab: string; children?: React.ReactNode }) {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	return (
		<ControlledContainer activeTab={activeTab} setActiveTab={setActiveTab}>
			{children}
		</ControlledContainer>
	);
}

export function ControlledContainer({ children, ...contextValues }: TabContext & { children?: React.ReactNode }) {
	const myContext = useMemo((): TabContext => contextValues, Object.values(contextValues));
	return <TabContextProvider value={myContext}>{children}</TabContextProvider>;
}
