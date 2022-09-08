import { capitalize } from 'lodash/fp';
import { Lens } from './lens';

export const keywordsAsStringLens = Lens.from<string[], string>(
	(keywords) => keywords.map(capitalize).join(', '),
	(mutator) => (draft) => {
		const keywords = mutator(draft.map(capitalize).join(', '));
		return keywords
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0);
	}
);
