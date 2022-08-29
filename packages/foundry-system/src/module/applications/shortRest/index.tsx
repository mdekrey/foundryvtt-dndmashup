import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { ShortRestConfiguration } from '@foundryvtt-dndmashup/mashup-react';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';

applicationRegistry.shortRest = async ({ actor }, resolve, reject) => ({
	content: (
		<div className="flex flex-col h-full p-2 gap-2">
			<ShortRestConfiguration evaluateBonuses={evaluateAndRoll} actor={actor} onClose={() => resolve(null)} />
		</div>
	),
	title: 'Short Rest',
	options: {
		resizable: false,
	},
});
