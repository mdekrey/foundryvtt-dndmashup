/* eslint-disable @typescript-eslint/no-explicit-any */

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type PathImpl<K extends string | number, V, Type, Omit = never> = V extends Type
	? `${K}`
	: V extends Primitive | Omit
	? never
	: `${K}.${PathNameWithOmit<V, Type, Omit>}`;

type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type ArrayKey = number;

type PathNameWithOmit<TDocument, TValue, TOmit = never> = TDocument extends TOmit
	? never
	: TDocument extends ReadonlyArray<infer V>
	? IsTuple<TDocument> extends true
		? {
				[K in TupleKey<TDocument>]-?: PathImpl<K & string, TDocument[K], TValue, TOmit>;
		  }[TupleKey<TDocument>]
		: PathImpl<ArrayKey, V, TValue, TOmit>
	: {
			[K in keyof TDocument]-?: PathImpl<K & string, TDocument[K], TValue, TOmit>;
	  }[keyof TDocument];

export type PathName<TTarget, TValue> = PathNameWithOmit<TTarget, TValue>;
export type PathNameNoArrays<TTarget, TValue> = PathNameWithOmit<TTarget, TValue, TValue | ReadonlyArray<any>>;

export function getFieldValue<TTarget, TValue>(data: TTarget, field: PathName<TTarget, TValue>) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const dataValue: TValue = field.split('.').reduce((prev, f) => prev && prev[f], data as any);
	return dataValue;
}
