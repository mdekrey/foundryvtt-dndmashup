import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';

export type ActiveEffectDocument = BaseDocument & {
	img: string | null;
	showEditDialog(): void;
};
