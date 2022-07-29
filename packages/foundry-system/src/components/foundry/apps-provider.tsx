import {
	ApplicationDispatcherContextProvider,
	ApplicationDispatcherContext,
	applicationRegistry,
} from '@foundryvtt-dndmashup/mashup-react';
import { ApplicationRegistryEntry, MashupApplicationType } from '@foundryvtt-dndmashup/mashup-react';

const applicationDispatcherContextValue: ApplicationDispatcherContext = {
	launchApplication<T extends MashupApplicationType>(
		messageType: T,
		...params: Parameters<ApplicationRegistryEntry<T>>
	): ReturnType<ApplicationRegistryEntry<T>> {
		return applicationRegistry[messageType](...params);
	},
};

export function WrapApplicationDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ApplicationDispatcherContextProvider value={applicationDispatcherContextValue}>
			{children}
		</ApplicationDispatcherContextProvider>
	);
}
