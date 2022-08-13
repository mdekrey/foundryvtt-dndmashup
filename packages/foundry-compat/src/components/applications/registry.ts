import { ApplicationRegistryEntry } from './types';

export const applicationRegistry: { [K in keyof MashupApplication]: ApplicationRegistryEntry<K> } = {} as never;
