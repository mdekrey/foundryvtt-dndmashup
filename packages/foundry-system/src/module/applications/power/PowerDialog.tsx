import { ReactApplicationMixin } from '../../../core/react';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';

export class PowerDialog extends ReactApplicationMixin(Dialog) {
	constructor(
		private item: PowerDocument,
		data: Omit<Dialog.Data, 'buttons' | 'default' | 'content'>,
		options?: Partial<DialogOptions>
	) {
		super({ ...data, content: '', buttons: {}, default: '' }, options);
	}

	protected override _getJsx(): JSX.Element {
		return <PowerPreview item={this.item} />;
	}

	static create(item: PowerDocument) {
		const dialog = new PowerDialog(item, {
			title: `Use Power: ${item.name}`,
		});
		dialog.render(true);
		return dialog;
	}
}
