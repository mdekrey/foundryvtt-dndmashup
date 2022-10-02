import { ActiveEffectDocument, ActiveEffectFlags } from '@foundryvtt-dndmashup/mashup-react';
import { Aura, FeatureBonus, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { createFinalEffectConstructorData } from '../actor/logic/createFinalEffectConstructorData';
import { MashupActor } from '../actor';
import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { fromMashupId } from '../../core/foundry';
import { CoreFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';

declare global {
	interface FlagConfig {
		ActiveEffect: {
			mashup?: ActiveEffectFlags['mashup'];
		};
	}
}

export class MashupActiveEffect extends ActiveEffect implements ActiveEffectDocument {
	flags!: FlagConfig['ActiveEffect'] & CoreFlags;

	icon!: string | null;
	label!: string | null;

	get displayName() {
		return this.name;
	}
	getOriginalSources(): BaseDocument[] {
		return this.flags.mashup?.originalSources?.map(fromMashupId).filter(Boolean) as BaseDocument[];
	}
	allAuras(): Aura[] {
		return this.flags.mashup?.auras ?? [];
	}

	allBonuses(): FeatureBonus[] {
		return this.flags.mashup?.bonuses ?? [];
	}

	allTriggeredEffects(): TriggeredEffect[] {
		return this.flags.mashup?.triggers ?? [];
	}

	get img(): string | null {
		return this.icon ?? null;
	}

	override get name(): string | null {
		return this.label;
	}

	showEditDialog(): void {
		this.sheet?.render(true, { focus: true });
	}

	override async delete(context?: DocumentModificationContext): Promise<this | undefined> {
		if (this.flags.mashup?.afterEffect) {
			return await this.update(
				createFinalEffectConstructorData(
					this.flags.mashup?.afterEffect,
					this.parent as MashupActor,
					this.flags.mashup?.originalSources
				)
			);
		} else {
			return await super.delete(context);
		}
	}

	async handleAfterFailedSave(): Promise<this | undefined> {
		if (this.flags.mashup?.afterFailedSave) {
			return await this.update(
				createFinalEffectConstructorData(
					this.flags.mashup.afterFailedSave,
					this.parent as MashupActor,
					this.flags.mashup?.originalSources
				)
			);
		}
		return this;
	}
}
