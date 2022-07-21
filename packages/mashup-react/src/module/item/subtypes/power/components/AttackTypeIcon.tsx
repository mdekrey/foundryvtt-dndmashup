import { EffectTypeAndRange } from '../dataSourceData';
import { MeleeIcon, RangedIcon, AreaIcon, CloseIcon, BasicMeleeIcon, BasicRangedIcon } from './icons';

export const iconMapping: Record<string, typeof MeleeIcon | undefined> = {
	melee: MeleeIcon,
	ranged: RangedIcon,
	close: CloseIcon,
	area: AreaIcon,
};

export const basicIconMapping: Record<string, typeof MeleeIcon | undefined> = {
	melee: BasicMeleeIcon,
	ranged: BasicRangedIcon,
};

export function AttackTypeIcon({
	attackType,
	isBasic,
	...props
}: {
	attackType: EffectTypeAndRange['type'];
	isBasic?: boolean;
} & JSX.IntrinsicElements['svg']) {
	const Icon = (isBasic ? basicIconMapping[attackType || ''] : null) ?? iconMapping[attackType || ''];
	if (!Icon) return null;
	return <Icon {...props} />;
}
