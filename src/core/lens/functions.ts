export const not =
	<T extends U, U>(f: (e: U) => e is T) =>
	(e: U): e is Exclude<T, U> =>
		!f(e);
export const or =
	<U, T extends U, S extends U>(f1: (e: U) => e is T, f2: (e: U) => e is S) =>
	(e: U): e is T | S =>
		f1(e) || f2(e);
