import { createContext, useContext } from 'react';
import { ModalDispatcherContext } from './types';

const modalDispatcherContext = createContext<ModalDispatcherContext | null>(null);

export const ModalDispatcherContextProvider = modalDispatcherContext.Provider;

export function useModalDispatcher(): ModalDispatcherContext {
	const result = useContext(modalDispatcherContext);
	if (!result) throw new Error('ModalDispatcherContextProvider not found');

	return result;
}
