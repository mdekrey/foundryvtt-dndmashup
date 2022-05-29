/* eslint-disable @typescript-eslint/no-explicit-any */

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type PathImpl<K extends string | number, V, Type, Omit = never> = V extends Type
	? `${K}`
	: V extends Primitive | Omit
	? never
	: `${K}.${PathNameWithOmit<V, Type, never>}`;

type PathNameWithOmit<TDocument, TValue, TOmit = never> = TDocument extends ReadonlyArray<any>
	? never
	: {
			[K in keyof TDocument]-?: PathImpl<K & string, TDocument[K], TValue, TOmit>;
	  }[keyof TDocument];

export type PathName<TDocument, TValue> = PathNameWithOmit<TDocument, TValue, TValue>;
