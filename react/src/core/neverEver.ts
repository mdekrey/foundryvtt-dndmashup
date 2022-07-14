export function neverEver(something: never): never {
	throw new Error(`something happened that never should have: ${something}`);
}
