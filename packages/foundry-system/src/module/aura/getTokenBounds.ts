type Foundry10Scene = {
	grid: {
		type: number;
		size: number;
	};
};
type Foundry10Token = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function getTokenBounds(token: TokenDocument, aura: number) {
	// TODO: Foundry 10 Upgrade
	const gridSize = (token.parent as never as Foundry10Scene | null)?.grid.size;
	if (!gridSize) return null;
	const auraGrid = aura * gridSize;
	return new PIXI.Rectangle(
		(token as never as Foundry10Token).x + 1 - auraGrid,
		(token as never as Foundry10Token).y + 1 - auraGrid,
		(token as never as Foundry10Token).width * gridSize - 2 + auraGrid * 2,
		(token as never as Foundry10Token).height * gridSize - 2 + auraGrid * 2
	);
}
