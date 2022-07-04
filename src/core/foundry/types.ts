/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Document,
	DocumentData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs';
import { ClientDocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document';
import { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { ItemDataBaseProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';

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
export type SourceDataOnlyOf<T extends AnyDocument> =
	SourceDataOf<T> extends PropertiesToSource<ItemDataBaseProperties> & infer U
		? U & Omit<ItemDataBaseProperties, 'data'>
		: never;
