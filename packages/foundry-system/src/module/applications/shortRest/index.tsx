import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { ShortRestConfiguration } from '@foundryvtt-dndmashup/mashup-react';

applicationRegistry.shortRest = async ({ actor }, resolve, reject) => ({
	content: (
		<div className="flex flex-col h-full p-2 gap-2">
			<ShortRestConfiguration actor={actor} onClose={() => resolve(null)} />
		</div>
	),
	title: 'Short Rest',
	options: {
		resizable: false,
	},
});
