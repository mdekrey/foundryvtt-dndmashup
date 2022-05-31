/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Document,
	DocumentData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs';

export type AnyDocument = Document<DocumentData<any, any, any, any, any>, any, any>;
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
