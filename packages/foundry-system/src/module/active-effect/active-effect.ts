import { ActiveEffectDocument, ActiveEffectFlags } from '@foundryvtt-dndmashup/mashup-react';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

declare global {
	interface FlagConfig {
		ActiveEffect: {
			mashup?: ActiveEffectFlags['mashup'];
		};
	}
}

export class MashupActiveEffect extends ActiveEffect implements ActiveEffectDocument {
	allBonuses(): FeatureBonus[] {
		return this.data.flags.mashup?.bonuses ?? [];
	}

	get img(): string | null {
		return this.data.icon ?? null;
	}

	override get name(): string | null {
		return this.data.label;
	}

	showEditDialog(): void {
		this.sheet?.render(true, { focus: true });
	}
}
