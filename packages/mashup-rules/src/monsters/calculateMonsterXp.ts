import { MonsterPowerLevel } from './powerLevels';

const standardXp = [
	100, 125, 150, 175, 200, 250, 300, 350, 400, 500, 600, 700, 800, 1_000, 1_200, 1_400, 1_600, 2_000, 2_400, 2_800,
	3_200, 4_150, 5_100, 6_050, 7_000, 9_000, 11_000, 13_000, 15_000, 19_000, 23_000, 27_000, 31_000, 39_000, 47_000,
	55_000, 63_000, 79_000, 95_000, 111_000,
];

const powerLevelMultiplier: Record<MonsterPowerLevel, number> = {
	minion: 0.25,
	standard: 1,
	elite: 2,
	solo: 5,
};

export function calculateMonsterXp(level: number, powerLevel: MonsterPowerLevel) {
	return Math.floor(standardXp[(level ?? 1) - 1] * (powerLevelMultiplier[powerLevel] ?? 1));
}
