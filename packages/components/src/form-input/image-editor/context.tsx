import { createContext, useContext } from 'react';
import { Stateful } from '@foundryvtt-dndmashup/mashup-core';

export type ImageEditorContext = (state: Stateful<string>) => void;

const imageEditorContext = createContext<ImageEditorContext | null>(null);

export const ImageEditorContextProvider = imageEditorContext.Provider;

export function useImageEditor(): ImageEditorContext {
	const result = useContext(imageEditorContext);
	if (!result) throw new Error('ImageEditorContextProvider not found');

	return result;
}
