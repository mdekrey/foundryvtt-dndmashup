import { createContext, useContext } from 'react';

const prerenderDetectionContext = createContext<boolean>(false);

export const PrerenderDetectionContextProvider = prerenderDetectionContext.Provider;

export function useIsPrerender(): boolean {
	return useContext(prerenderDetectionContext);
}
