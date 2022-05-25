import { rootPath } from 'src/module/constants';

export const templatePath = `${rootPath}/module/bonuses/templates` as const;

export const templatePathSharedParts = {
	bonuses: `${templatePath}/bonuses.html` as const,
};
