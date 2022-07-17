/* eslint-disable @typescript-eslint/no-explicit-any */
import { Primitive } from 'dndmashup-react/src/core/path-typings';

export { Primitive };

type PathImpl<K extends string | number, V, Type> = V extends NoStringPath
	? never
	: V extends Type
	? `${K}`
	: V extends Primitive
	? never
	: `${K}.${PathName<V, Type>}`;

type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type ArrayKey = number;

export type PathName<TTarget, TValue> = TTarget extends NoStringPath
	? never
	: TTarget extends ReadonlyArray<infer V>
	? IsTuple<TTarget> extends true
		? {
				[K in TupleKey<TTarget>]-?: PathImpl<K & string, TTarget[K], TValue>;
		  }[TupleKey<TTarget>]
		: PathImpl<ArrayKey, V, TValue>
	: {
			[K in keyof TTarget]-?: PathImpl<K & string, TTarget[K], TValue>;
	  }[keyof TTarget];

export function getFieldValue<TTarget, TValue>(data: TTarget, field: PathName<TTarget, TValue>) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const dataValue: TValue = field.split('.').reduce((prev, f) => prev && prev[f], data as any);
	return dataValue;
}

export function combinePath<TStart, TMiddle, TEnd>(
	path1: PathName<TStart, TMiddle>,
	path2: PathName<TMiddle, TEnd>
): PathName<TStart, TEnd> {
	return `${path1}.${path2}` as PathName<TStart, TEnd>;
}

const NoStringPathSymbol: unique symbol = Symbol();
export type NoStringPath = { [NoStringPathSymbol]?: never };
