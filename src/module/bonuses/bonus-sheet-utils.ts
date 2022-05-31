import { BonusTarget, ConditionRule } from './constants';
import { FeatureBonus } from './types';

type BonusSheetListConfiguration = () => FeatureBonus[];

export const targets: Record<BonusTarget, string> = {
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

export const conditions: Record<ConditionRule, string> = {
	proficientIn: 'When you are proficient with the item',
	bloodied: 'When you are bloodied',
};

export function getBonusesContext() {
	return { targets, conditions };
}

export function attachBonusSheet(
	html: JQuery<HTMLElement>,
	sheet: DocumentSheet,
	configs: Record<string, BonusSheetListConfiguration>
) {
	html.find('[data-bonus-add]').on('click', function (event) {
		const { name, config } = getListInfo(event.target);
		const list = config();
		const idx = list?.length;
		const newElem: FeatureBonus = {
			amount: '0',
			target: 'defense-ac',
			...(list[idx - 1] as Partial<FeatureBonus>),
		};

		submit({ [`${name}.${idx}`]: newElem });
	});

	html.find('[data-bonus-disable]').on('click', function (event) {
		const { path } = getListInfo(event.target);
		submit({ [`${path}.disabled`]: true });
	});

	html.find('[data-bonus-enable]').on('click', function (event) {
		const { path } = getListInfo(event.target);
		submit({ [`${path}.disabled`]: undefined });
	});

	html.find('[data-bonus-delete]').on('click', async function (event) {
		event.target.closest<HTMLElement>('[data-bonus-index]')?.remove();
		await submit();
		sheet.render();
	});

	function getListInfo(element: HTMLElement) {
		const name = element.closest<HTMLElement>('[data-bonus-list]')?.dataset.bonusList;
		if (!name) {
			console.error('could not find list name for', element);
			throw new Error('could not find list name');
		}
		const index = Number(element.closest<HTMLElement>('[data-bonus-index]')?.dataset.bonusIndex);
		return {
			name,
			get index() {
				if (index === null || isNaN(index)) {
					console.error('could not find bonus index for', element);
					throw new Error('could not find bonus index');
				}
				return index;
			},
			get config() {
				const config = name ? configs[name] : undefined;
				if (!config) {
					console.error('could not find bonus list config for', element);
					throw new Error('could not find bonus list');
				}
				return config;
			},
			get path() {
				return `${this.name}.${this.index}`;
			},
		};
	}

	function submit(updateData?: object) {
		return sheet.submit({ preventClose: true, updateData });
	}
}
