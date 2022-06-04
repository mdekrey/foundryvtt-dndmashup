/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Document,
	DocumentData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs';
import { ClientDocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document';

export type AnyDocument = InstanceType<
	ClientDocumentConstructor<ConstructorOf<Document<DocumentData<any, any, any, any, any>, any, any>>>
>;
export type DataOfDocument<T extends AnyDocument> = T['data'];
export type SourceDataOf<T extends AnyDocument> = DataOfDocument<T> extends DocumentData<
	any,
	any,
	infer TData,
	any,
	any
>
	? TData
	: never;

export type ArrayRecord<T> = Array<T> | Record<number, T>;
