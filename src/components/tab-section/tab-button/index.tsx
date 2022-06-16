import classNames from 'classnames';
import { useTabContext } from '../internals/context';

export function TabButton({ tabName, children }: { tabName: string; children?: React.ReactNode }) {
	const { activeTab, setActiveTab } = useTabContext();

	return (
		<button
			type="button"
			onClick={() => setActiveTab(tabName)}
			className={classNames(
				'ring-transparent hover:ring-blue-bright-600 focus:ring-blue-bright-600 cursor-pointer ring-text-shadow uppercase',
				{
					'font-bold': activeTab === tabName,
				}
			)}>
			{children}
		</button>
	);
}
