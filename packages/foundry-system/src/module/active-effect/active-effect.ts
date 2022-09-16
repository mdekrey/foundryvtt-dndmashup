import { ActiveEffectDocument, ActiveEffectFlags } from '@foundryvtt-dndmashup/mashup-react';
import { Aura, FeatureBonus, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';

declare global {
	interface FlagConfig {
		ActiveEffect: {
			mashup?: ActiveEffectFlags['mashup'];
		};
	}
}

export class MashupActiveEffect extends ActiveEffect implements ActiveEffectDocument {
	allAuras(): Aura[] {
		return this.data.flags.mashup?.auras ?? [];
	}

	allBonuses(): FeatureBonus[] {
		return this.data.flags.mashup?.bonuses ?? [];
	}

	allTriggeredEffects(): TriggeredEffect[] {
		return this.data.flags.mashup?.triggers ?? [];
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
