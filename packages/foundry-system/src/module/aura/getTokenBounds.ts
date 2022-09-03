export function getTokenBounds(token: TokenDocument, aura: number) {
	if (!token.parent?.data.grid) return null;
	const auraGrid = aura * token.parent.data.grid;
	return new NormalizedRectangle(
		token.data.x + 1 - auraGrid,
		token.data.y + 1 - auraGrid,
		token.data.width * token.parent.data.grid - 2 + auraGrid * 2,
		token.data.height * token.parent.data.grid - 2 + auraGrid * 2
	);
}
