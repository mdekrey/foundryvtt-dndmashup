/** See @type ItemDataBaseProperties */
export type StandardData = {
	_id: string | null;
	name: string;
	img: string | null;
	folder: string | null;
	sort: number;
};

export type SimpleDocumentData<TData = unknown> = TData & StandardData;

/**
 * Represents a simple document without using the Foundry types to try to speed up conpilation
 */
export type SimpleDocument<TData = unknown> = {
	id: string | null;
	name: string | null;
	img: string | null;
	isOwner: boolean;
	data: SimpleDocumentData<TData>;
	type: TData extends { type: infer TType } ? TType : unknown;

	readonly items: { contents: SimpleDocument[] };

	// first parameter should be SimpleDocumentData<TData> but doesn't really match yet
	update(newData: unknown, options: { overwrite?: boolean; diff?: boolean; recursive?: boolean }): void;
	delete(): void;
	showEditDialog(): void;
};
