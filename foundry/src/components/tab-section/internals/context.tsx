import { createContext, useContext } from 'react';

export type TabContext = {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const tabContext = createContext<TabContext | null>(null);

export function useTabContext() {
	const result = useContext(tabContext);
	if (!result) throw new Error('Attempting to use a Tab component outside of a TabSection');
	return result;
}

export const TabContextProvider = tabContext.Provider;
