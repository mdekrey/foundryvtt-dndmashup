import { Trigger, TriggerType } from './types';
import { TriggerRegistryEntry, triggersRegistry } from './registry';

export function getTriggerText<TType extends TriggerType>(trigger: Trigger<TType>) {
	const registryEntry: TriggerRegistryEntry<TType> = triggersRegistry[trigger.trigger];
	return registryEntry.text(trigger.parameter);
}
