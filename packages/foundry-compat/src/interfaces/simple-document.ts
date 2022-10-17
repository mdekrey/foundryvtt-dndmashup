import { SimpleApplication } from '@foundryvtt-dndmashup/components';

export type DataSourceBase = { system: unknown };

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
	get uuid(): string;
	id: string | null;
	name: string | null;
	isOwner: boolean;
	collectionName: string;
	readonly parent?: BaseDocument | null;

	sheet: SimpleApplication | null;

	update(
		newData: unknown,
		options: { overwrite?: boolean; diff?: boolean; recursive?: boolean; ignoreEmbedded?: boolean }
	): void;
	delete(): void;
};

/**
 * Represents a simple document without using the Foundry types to try to speed up conpilation
 */
export type SimpleDocument<
	TData extends DataSourceBase = unknown & DataSourceBase,
	TDerivedData = unknown
> = BaseDocument & {
	_source: SimpleDocumentData<TData>;
	system: TData['system'] & TDerivedData;
	type: TData extends { type: infer TType } ? TType : unknown;
	displayName: string | null;
	img: string | null;

	readonly items: { contents: SimpleDocument[] };

	showEditDialog(): void;
};
