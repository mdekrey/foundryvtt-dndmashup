import { SimpleApplication } from '@foundryvtt-dndmashup/components';

/** See @type ItemDataBaseProperties */
export type StandardData = {
	_id: string | null;
	name: string;
	img: string | null;
	folder: string | null;
	sort: number;
};

export type SimpleDocumentData<TData = unknown> = TData & StandardData;

export type BaseDocument = {
	id: string | null;
	name: string | null;
	isOwner: boolean;
	collectionName: string;
	readonly parent?: BaseDocument | null;

	sheet: SimpleApplication | null;

	update(newData: unknown, options: { overwrite?: boolean; diff?: boolean; recursive?: boolean }): void;
	delete(): void;
};

/**
 * Represents a simple document without using the Foundry types to try to speed up conpilation
 */
export type SimpleDocument<TData = unknown> = BaseDocument & {
	data: SimpleDocumentData<TData>;
	type: TData extends { type: infer TType } ? TType : unknown;
	img: string | null;

	readonly items: { contents: SimpleDocument[] };

	showEditDialog(): void;
};
