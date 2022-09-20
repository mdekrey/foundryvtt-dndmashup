import { useTabContext } from '../internals/context';

export function Tab({ children, tabName }: { children?: React.ReactNode; tabName: string }) {
	const { activeTab, renderAllTabs } = useTabContext();

	if (renderAllTabs) {
		return <div className={activeTab !== tabName ? 'hidden' : undefined}>{children}</div>;
	}

	if (activeTab !== tabName) return null;

	return <>{children}</>;
}
