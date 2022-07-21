import { Draft } from 'immer';

export type ImmerMutator<T> = (draft: Draft<T>) => Draft<T> | T | undefined | void;
export type Mutator<T> = (draft: Draft<T>) => T | Draft<T>;

export type ImmutableMutatorOptions = { deleteData: boolean };
export type ImmutableMutator<T> = (mutator: ImmerMutator<T>, config?: Partial<ImmutableMutatorOptions>) => void;

export type Stateful<T> = { value: T; onChangeValue: ImmutableMutator<T> };
