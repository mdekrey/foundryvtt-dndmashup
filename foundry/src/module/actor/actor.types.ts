import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseActor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseActor';
import type DocumentData from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';
import type {
	ActorDataBaseProperties,
	ActorDataBaseSource,
	ActorDataConstructorData,
	ActorDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { TypedData } from 'dndmashup-react/types/types';

export type ActorData<TData, TSource extends TypedData<string, unknown>> = DocumentData<
	ActorDataSchema,
	ActorDataBaseProperties & TData,
	PropertiesToSource<ActorDataBaseProperties> & TSource,
	ActorDataConstructorData,
	BaseActor
> &
	ActorDataBaseProperties &
	TData & {
		_initializeSource(
			data: Omit<ActorDataConstructorData, 'type' | 'data'> & { type: TSource['type']; data?: DeepPartial<TSource> }
		): ActorDataBaseSource & TSource;

		_initialize(): void;
	};
