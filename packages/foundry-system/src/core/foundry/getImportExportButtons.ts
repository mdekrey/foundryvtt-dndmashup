import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { noop } from 'lodash/fp';

export function getImportExportButtons(target: SimpleDocument): Application.HeaderButton[] {
	return [
		{
			label: 'Import JSON',
			class: 'item-upload-data',
			icon: 'fas fa-upload',
			onclick: noop,
		},
		{
			label: 'Export JSON',
			class: 'item-download-data',
			icon: 'fas fa-download',
			onclick() {
				navigator.clipboard.writeText(JSON.stringify((target.data as any)._source)).then(() => {
					ui.notifications?.info(`Copied ${target.name} to clipboard`);
				});
			},
		},
	];
}
