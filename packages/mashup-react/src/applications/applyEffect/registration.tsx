import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { ApplyEffectDisplay } from './ApplyEffectDisplay';

// TODO - pass targets into this
applicationRegistry.applyEffect = async ({ effectParams }, resolve, reject) => ({
	content: (
		<div className="flex flex-col h-full p-2 gap-2">
			<ApplyEffectDisplay effectParams={effectParams} onClose={() => resolve(null)} />
		</div>
	),
	title: 'Apply Effect',
	options: {
		resizable: false,
	},
});
