import { createContext, useContext } from 'react';

export type SheetContext<T extends DocumentSheet = DocumentSheet> = T;

const sheetFrameworkContext = createContext<null | SheetContext>(null);

export const Provider = sheetFrameworkContext.Provider;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSheetContext<T extends DocumentSheet>() {
	const ctx = useContext(sheetFrameworkContext);
	if (ctx === null) throw new Error('Not within a sheet context');

	return ctx as SheetContext<T>;
}
