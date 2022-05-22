import { BonusTarget, ConditionRule } from './constants';
import { FeatureBonus } from './types';

type BonusSheetListConfiguration = {
	get: () => FeatureBonus[];
	update: (mutator: (previous: readonly FeatureBonus[]) => FeatureBonus[]) => Promise<void>;
};

function update<T>(array: readonly T[], index: number, fn: (target: T) => T) {
	const copy = array.slice();
	copy[index] = fn(copy[index]);
	return copy;
}

const targets: Record<BonusTarget, string> = {
	'ability-str': 'STR',
	'ability-con': 'CON',
	'ability-dex': 'DEX',
	'ability-int': 'INT',
	'ability-wis': 'WIS',
	'ability-cha': 'CHA',
	'defense-ac': 'AC',
	'defense-fort': 'FORT',
	'defense-refl': 'REFL',
	'defense-will': 'WILL',
	'surges-max': 'Surges per Day',
	'surges-value': 'HP per Surge',
	maxHp: 'Maximum HP',
	speed: 'Speed',
};

const conditions: Record<ConditionRule, string> = {
	proficientIn: 'When you are proficient with the item',
	bloodied: 'When you are bloodied',
};

export function getBonusesContext() {
	return { targets, conditions };
}

export function attachBonusSheet(html: JQuery<HTMLElement>, lists: Record<string, BonusSheetListConfiguration>) {
	html.find('[data-bonus-add]').on('click', function (event) {
		const listConfig = getListConfig(event.target);
		listConfig.update((list) => {
			const last: Partial<FeatureBonus> = list[list.length - 1];
			const newElem: FeatureBonus = {
				amount: '0',
				target: 'defense-ac',
				...last,
			};
			return [...list, newElem];
		});
	});

	html.find('[data-bonus-disable]').on('click', function (event) {
		const listConfig = getListConfig(event.target);
		const index = getListIndex(event.target);
		listConfig.update((list) => {
			return update(list, index, (b) => ({ ...b, disabled: true }));
		});
	});

	html.find('[data-bonus-enable]').on('click', function (event) {
		const listConfig = getListConfig(event.target);
		const index = getListIndex(event.target);
		// Removes 'disabled' from the elment
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		listConfig.update((list) => update(list, index, ({ disabled, ...b }) => b));
	});

	html.find('[data-bonus-delete]').on('click', function (event) {
		const listConfig = getListConfig(event.target);
		const index = getListIndex(event.target);
		listConfig.update((list) => {
			const copy = list.slice();
			copy.splice(index, 1);
			return copy;
		});
	});

	html.find('[data-name]').on('change', function (event) {
		const listConfig = getListConfig(event.target);
		const index = getListIndex(event.target);
		const property = event.target.getAttribute('data-name') as keyof FeatureBonus;
		const newValue = $(event.target).val();

		listConfig.update((list) => update(list, index, (bonus) => ({ ...bonus, [property]: newValue })));
	});

	function getListConfig(element: HTMLElement) {
		const listName = element.closest('[data-bonus-list]')?.getAttribute('data-bonus-list');
		const list = listName && lists[listName];
		if (!list) {
			console.error('could not find bonus list for', element);
			throw new Error('could not find bonus list');
		}
		return list;
	}

	function getListIndex(element: HTMLElement) {
		const index = Number(element.closest('[data-bonus-index]')?.getAttribute('data-bonus-index'));
		const n = Number(index);
		if (index === null || isNaN(n)) {
			console.error('could not find bonus index for', element);
			throw new Error('could not find bonus index');
		}
		return n;
	}
}
