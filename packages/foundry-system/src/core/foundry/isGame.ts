export function isGame(g: typeof game): g is Game {
	return 'actors' in g;
}
