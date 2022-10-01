import { AppButton } from '@foundryvtt-dndmashup/components';
import { deferredPromise } from '@foundryvtt-dndmashup/core';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { noop } from 'lodash/fp';
import { ReactApplicationMixin } from '../react/react-application-mixin';

const defaultIcon = 'icons/svg/item-bag.svg';

export function getImportExportButtons(target: SimpleDocument): Application.HeaderButton[] {
	return [
		{
			label: 'Import JSON',
			class: 'item-upload-data',
			icon: 'fas fa-upload',
			onclick() {
				const { promise, resolve, reject } = deferredPromise<string>();
				const source = getSource();
				const dialog = new ImportDialog(
					source,
					resolve,
					{ title: `Import JSON for ${target.name}`, close: reject },
					{ resizable: true }
				);
				dialog.render(true);

				promise
					.then((newJson) => {
						const newSource = JSON.parse(newJson);
						newSource.img = newSource === defaultIcon ? target.img : newSource.img;
						target.update(newSource, { overwrite: true, diff: false, recursive: false });
						dialog.close();
					})
					.catch(noop);
			},
		},
		{
			label: 'Export JSON',
			class: 'item-download-data',
			icon: 'fas fa-download',
			async onclick() {
				await navigator.clipboard.writeText(getSource());
				ui.notifications?.info(`Copied ${target.name} to clipboard`);
			},
		},
	];

	function getSource() {
		const copy = { ...(target.system as any)._source };
		delete copy._id;
		delete copy.folder;
		delete copy.sort;
		delete copy.permission;
		const source = JSON.stringify(copy, undefined, 2);
		return source;
	}
}

export class ImportDialog extends ReactApplicationMixin(Dialog) {
	constructor(
		public json: string,
		private setNewJson: (newContent: string) => void,
		data: Omit<Dialog.Data, 'buttons' | 'default' | 'content'>,
		options?: Partial<DialogOptions>
	) {
		super({ ...data, content: '', buttons: {}, default: '' }, options);
	}

	protected override _getJsx(): JSX.Element {
		return (
			<div className="min-h-64 flex flex-col gap-1">
				<textarea
					defaultValue={this.json}
					ref={(target) => {
						target?.focus();
						target?.select();
					}}
					onChange={(ev) => {
						this.json = ev.currentTarget.value;
					}}
					className="resize-none w-full flex-grow border border-black bg-white p-1 font-mono"
				/>
				<div className="grid grid-cols-2 gap-1">
					<AppButton onClick={() => this.close()}>Cancel</AppButton>
					<AppButton onClick={() => this.setNewJson(this.json)}>Confirm</AppButton>
				</div>
			</div>
		);
	}
}
