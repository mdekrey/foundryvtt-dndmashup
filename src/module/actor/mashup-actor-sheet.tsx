import { ActorSheetJsx } from './templates/sheet';
import { ReactSheetMixin } from 'src/core/react';

export class MashupActorSheet extends ReactSheetMixin(ActorSheet) {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes added to parent element of template
			classes: ['foobar'],
			width: 844,
			height: 915,
			tabs: [
				{
					navSelector: `nav[data-group='primary']`,
					contentSelector: 'section[data-tab-section]',
					initial: 'description',
				},
			],
		});
	}

	protected override _getJsx(): JSX.Element {
		return <ActorSheetJsx sheet={this} />;
	}
}
