/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Document,
	DocumentData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs';
import { ClientDocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document';

export type AnyDocument = InstanceType<
	ClientDocumentConstructor<ConstructorOf<Document<DocumentData<any, any, any, any, any>, any, any>>>
>;
