export function neverEver(something: never) {
	throw new Error(`something happened that never should have: ${something}`);
}
