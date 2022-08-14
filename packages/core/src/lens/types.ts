export type ImmerMutator<T> = (draft: T) => T | undefined | void;
export type Mutator<T> = (draft: T) => T;

export type ImmutableMutatorOptions = { deleteData: boolean };
export type ImmutableMutator<T> = (mutator: ImmerMutator<T>, config?: Partial<ImmutableMutatorOptions>) => void;

export type Stateful<T> = { value: T; onChangeValue: ImmutableMutator<T> };
