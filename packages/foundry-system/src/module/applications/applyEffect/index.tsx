import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { ApplyEffectDisplay } from '@foundryvtt-dndmashup/mashup-react';
import { isGame } from '../../../core/foundry/isGame';
import type { MashupActor } from '../../actor';

applicationRegistry.applyEffect = async ({ effectParams }, resolve, reject) => {
	return {
		content: (
			<div className="flex flex-col h-full p-2 gap-2">
				<ApplyEffectDisplay targets={getTargets()} effectParams={effectParams} onClose={() => resolve(null)} />
			</div>
		),
		title: 'Apply Effect',
		options: {
			resizable: false,
		},
	};
};

function getTargets() {
	if (!isGame(game)) return [];
	const tokens = game.canvas?.tokens?.controlled ?? [];
	return tokens.map((t) => t.actor).filter((t): t is MashupActor => !!t);
}
