import { ReactApplicationMixin } from 'src/core/react';
import { SpecificActor } from 'src/module/actor/mashup-actor';
import { PowerPreview } from 'src/module/item/subtypes/power/components/PowerPreview';
import { MashupPower } from 'src/module/item/subtypes/power/config';

export class PowerDialog extends ReactApplicationMixin(Dialog) {
	constructor(
		private item: MashupPower,
		private actor: SpecificActor,
		data: Omit<Dialog.Data, 'buttons' | 'default' | 'content'>,
		options?: Partial<DialogOptions>
	) {
		super({ ...data, content: '', buttons: {}, default: '' }, options);
	}

	protected override _getJsx(): JSX.Element {
		return <PowerPreview item={this.item} />;
	}

	static create(item: MashupPower, actor: SpecificActor) {
		return new Promise((resolve, reject) => {
			const dialog = new PowerDialog(item, actor, {
				title: `Use Power: ${item.name}`,
				close: () => reject(),
			});
			dialog.render(true);
		});
	}
}
