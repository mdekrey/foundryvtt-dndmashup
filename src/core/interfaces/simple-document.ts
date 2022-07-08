/** See @type ItemDataBaseProperties */
export type StandardData = {
	_id: string | null;
	name: string;
	img: string | null;
	folder: string | null;
	sort: number;
};

/**
 * Represents a simple document without using the Foundry types to try to speed up conpilation
 */
export type SimpleDocument<TData = unknown> = {
	id: string | null;
	name: string | null;
	img: string | null;
	isOwner: boolean;
	data: TData & StandardData;

	delete(): void;
	showEditDialog(): void;
};
