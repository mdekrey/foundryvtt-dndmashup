import { createContext, useContext, useState } from 'react';

export type UserPreferencesContext = {
	getUserPreference<T extends string | boolean | number>(key: string): T | undefined;
	setUserPreference<T extends string | boolean | number>(key: string, value: T | undefined): Promise<unknown>;
};

const userPreferenceContext = createContext<UserPreferencesContext | null>(null);

export const UserPreferenceContextProvider = userPreferenceContext.Provider;

export function useUserPreference<T extends string | boolean | number | undefined>(
	key: string,
	defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const result = useContext(userPreferenceContext);
	if (!result) throw new Error('UserPreferenceContextProvider not found');

	const origValue = result.getUserPreference<Exclude<T, undefined>>(key) as T;
	const [value, setValue] = useState(origValue);

	return [
		value ?? defaultValue,
		async (mutator) => {
			const newValue: T =
				typeof mutator === 'function'
					? mutator(result.getUserPreference<Exclude<T, undefined>>(key) ?? defaultValue)
					: mutator;

			setValue(newValue);
			await result.setUserPreference(key, newValue);
		},
	];
}
