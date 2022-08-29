import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { LongRestConfiguration } from './LongRestConfiguration';

applicationRegistry.longRest = async ({ actor }, resolve, reject) => ({
	content: (
		<div className="flex flex-col h-full p-2 gap-2">
			<LongRestConfiguration actor={actor} onClose={() => resolve(null)} />
		</div>
	),
	title: 'Long Rest',
	options: {
		resizable: false,
	},
});
