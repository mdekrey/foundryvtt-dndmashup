import { SimpleApplication } from '../../interfaces';
import { createContext, useContext } from 'react';

/** See import('packages\foundry-system\node_modules\@league-of-foundry-developers\foundry-vtt-types\src\foundry\client\apps\app.d.ts').ModalOptions */
export type ApplicationOptions = {
	/**
	 * The default pixel width for the rendered HTML
	 * @defaultValue `null`
	 */
	width: number | null;

	/**
	 * The default pixel height for the rendered HTML
	 * @defaultValue `null`
	 */
	height: number | 'auto' | null;

	/**
	 * Whether the rendered modal can be drag-resized (popOut only)
	 * @defaultValue `false`
	 */
	resizable: boolean;
};

export type ApplicationSettings = {
	content: JSX.Element;
	title: string;
	options?: Partial<ApplicationOptions>;
};

export type UpdatableModal = {
	modal: SimpleApplication;
	updateContent: (content: JSX.Element) => void;
};

export type ModalDispatcherContext = {
	launchModal(settings: ApplicationSettings, onClose: () => void): UpdatableModal;
};

const modalDispatcherContext = createContext<ModalDispatcherContext | null>(null);

export const ModalDispatcherContextProvider = modalDispatcherContext.Provider;

export function useModalDispatcher(): ModalDispatcherContext {
	const result = useContext(modalDispatcherContext);
	if (!result) throw new Error('ModalDispatcherContextProvider not found');

	return result;
}
