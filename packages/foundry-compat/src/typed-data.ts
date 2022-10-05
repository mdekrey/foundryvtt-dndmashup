export type TypedData<T extends string, TData> = { _id: string; type: T; system: TData };
