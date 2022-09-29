import { ActiveEffectDocument, ActiveEffectFlags } from '@foundryvtt-dndmashup/mashup-react';
import { Aura, FeatureBonus, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { createFinalEffectConstructorData } from '../actor/logic/createFinalEffectConstructorData';
import { MashupActor } from '../actor';
import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { fromMashupId } from '../../core/foundry';

declare global {
	interface FlagConfig {
		ActiveEffect: {
			mashup?: ActiveEffectFlags['mashup'];
		};
	}
}

export class MashupActiveEffect extends ActiveEffect implements ActiveEffectDocument {
	get displayName() {
		return this.name;
	}
	getOriginalSources(): BaseDocument[] {
		return this.data.flags.mashup?.originalSources?.map(fromMashupId).filter(Boolean) as BaseDocument[];
	}
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

	override async delete(context?: DocumentModificationContext): Promise<this | undefined> {
		if (this.data.flags.mashup?.afterEffect) {
			return await this.update(
				createFinalEffectConstructorData(
					this.data.flags.mashup?.afterEffect,
					this.parent as MashupActor,
					this.data.flags.mashup?.originalSources
				)
			);
		} else {
			return await super.delete(context);
		}
	}

	async handleAfterFailedSave(): Promise<this | undefined> {
		if (this.data.flags.mashup?.afterFailedSave) {
			return await this.update(
				createFinalEffectConstructorData(
					this.data.flags.mashup.afterFailedSave,
					this.parent as MashupActor,
					this.data.flags.mashup?.originalSources
				)
			);
		}
		return this;
	}
}
