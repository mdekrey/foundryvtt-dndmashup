import { MashupTokenDocument } from '../token/mashup-token-document';

type Foundry10Scene = {
	grid: {
		type: number;
		size: number;
	};
};

export function getTokenBounds(token: MashupTokenDocument, aura: number) {
	// TODO: Foundry 10 Upgrade
	const gridSize = (token.parent as never as Foundry10Scene | null)?.grid.size;
	if (!gridSize) return null;
	const auraGrid = aura * gridSize;
	return new PIXI.Rectangle(
		token.x + 1 - auraGrid,
		token.y + 1 - auraGrid,
		token.width * gridSize - 2 + auraGrid * 2,
		token.height * gridSize - 2 + auraGrid * 2
	);
}
