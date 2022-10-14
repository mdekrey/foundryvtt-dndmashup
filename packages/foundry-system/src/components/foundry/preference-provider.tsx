import { UserPreferenceContextProvider, UserPreferencesContext } from '@foundryvtt-dndmashup/foundry-compat';
import { isGame } from '../../core/foundry';
import { systemName } from '../../module/constants';

declare global {
	interface FlagConfig {
		User: {
			[systemName]?: {
				preferences?: Record<string, string | number | boolean>;
			};
		};
	}
}

const userPreferenceAccessor: UserPreferencesContext = {
	getUserPreference<T extends string | number | boolean>(key: string): T | undefined {
		if (!isGame(game) || !game.user) return undefined;
		const flags: FlagConfig['User'] = (game.user as any)._source.flags;
		if (!flags[systemName]?.preferences) return undefined;
		return flags[systemName]?.preferences?.[key] as T | undefined;
	},
	async setUserPreference<T extends string | number | boolean>(key: string, value: T | undefined): Promise<unknown> {
		if (!isGame(game) || !game.user) return Promise.reject();
		if (value === undefined) return await game.user.update({ [`flags.${systemName}.preferences.-=${key}`]: undefined });
		else return await game.user.update({ [`flags.${systemName}.preferences.${key}`]: value });
	},
};

export function WrapUserPreferenceContextProvider({ children }: { children?: React.ReactNode }) {
	return <UserPreferenceContextProvider value={userPreferenceAccessor}>{children}</UserPreferenceContextProvider>;
}
