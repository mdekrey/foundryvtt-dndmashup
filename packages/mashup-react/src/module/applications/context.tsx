import { createContext, useContext } from 'react';
import { ApplicationRegistryEntry, MashupApplicationType } from './types';

export type ApplicationDispatcherContext = {
	launchApplication<T extends MashupApplicationType>(
		messageType: T,
		...params: Parameters<ApplicationRegistryEntry<T>>
	): ReturnType<ApplicationRegistryEntry<T>>;
};

const applicationDispatcherContext = createContext<ApplicationDispatcherContext | null>(null);

export const ApplicationDispatcherContextProvider = applicationDispatcherContext.Provider;

export function useApplicationDispatcher(): ApplicationDispatcherContext {
	const result = useContext(applicationDispatcherContext);
	if (!result) throw new Error('ApplicationDispatcherContextProvider not found');

	return result;
}
