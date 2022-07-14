import { useTabContext } from '../internals/context';

export function Tab({ children, tabName }: { children?: React.ReactNode; tabName: string }) {
	const { activeTab } = useTabContext();

	if (activeTab !== tabName) return null;

	return <>{children}</>;
}
