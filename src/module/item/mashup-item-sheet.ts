import { templatePath } from '../constants';

export class MashupItemSheet extends ItemSheet {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [],
			width: 585,
			height: 420,
		});
	}

	override get template() {
		return `${templatePath}/item/${this.item.data.type}-sheet.html`;
	}
}
