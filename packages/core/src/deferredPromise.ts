export function deferredPromise<T>(): {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (reason?: unknown) => void;
} {
	let tempResolve: ((value: T) => void) | undefined = undefined;
	let tempReject: ((reason?: unknown) => void) | undefined = undefined;

	const resultPromise = new Promise<T>((resolve, reject) => {
		tempResolve = resolve;
		tempReject = reject;
	});
	if (!tempResolve || !tempReject) throw new Error(`Promise didn't provide callbacks.`);

	return { promise: resultPromise, resolve: tempResolve, reject: tempReject };
}
