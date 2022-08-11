import { TabbedSheet as OriginalTabbedSheet } from './tabbed-sheet';
import { TabbedSheetTab } from './tabbed-sheet-tab';

export type { TabbedSheetTabProps } from './tabbed-sheet-tab';

export const TabbedSheet = Object.assign(OriginalTabbedSheet, {
	Tab: TabbedSheetTab,
});
