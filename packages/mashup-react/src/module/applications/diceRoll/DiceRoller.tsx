export type DiceRollerProps = {
	baseDice: string;
	onRoll(dice: string): void;
};

export function DiceRoller({ baseDice, onRoll }: DiceRollerProps) {
	return (
		<>
			<p>{baseDice}</p>
			<button onClick={() => onRoll(baseDice)}>Roll</button>
		</>
	);
}
