import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';

export function getParentButtons(target: SimpleDocument): Application.HeaderButton[] {
	if (target.parent?.sheet) {
		return [
			{
				label: 'Parent',
				class: 'item-view-parent',
				icon: 'fas fa-angle-double-up',
				onclick() {
					target.parent?.sheet?.render(true);
					target.parent?.sheet?.bringToTop();
				},
			},
		];
	}
	return [];
}
