import { CommonDataProperties } from './types';

export function calculateMaxHp(data: CommonDataProperties) {
	// TODO: should use the final con score, but I didn't write anything to populate it yet
	return 10 + data.abilityScores.con.base * 2;
}
