import { SimpleApplication } from '@foundryvtt-dndmashup/foundry-compat';
import { createContext, useContext } from 'react';
import { MashupApplicationResultType, MashupApplicationType } from './types';

export type ApplicationDispatcherContext = {
	launchApplication<T extends MashupApplicationType>(
		messageType: T,
		param: MashupApplication[T]
	): Promise<{ dialog: SimpleApplication; result: Promise<MashupApplicationResultType<T>> }>;
};

const applicationDispatcherContext = createContext<ApplicationDispatcherContext | null>(null);

export const ApplicationDispatcherContextProvider = applicationDispatcherContext.Provider;

export function useApplicationDispatcher(): ApplicationDispatcherContext {
	const result = useContext(applicationDispatcherContext);
	if (!result) throw new Error('ApplicationDispatcherContextProvider not found');

	return result;
}
