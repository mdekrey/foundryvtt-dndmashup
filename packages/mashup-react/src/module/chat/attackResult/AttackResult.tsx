import { AttackRollResult, RollInfo, RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { InstantaneousEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument, TokenInstance } from '../../actor';
import { EquipmentDocument, PowerDocument } from '../../item';
import { InstantaneousEffectSection, AttackEffectTrigger } from '../../../effects';
import { useControlTokenOnClick, useHoverToken } from '../../../components';

export type AttackResultEntryProps = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: AttackRollResult | null;
	rollData: RollJson;
};

export const AttackResult = ({
	entries,
	lookupToken,
	actor,
	power,
	tool,
}: {
	entries: AttackResultEntryProps[];
	lookupToken: (tokenId: string) => TokenInstance | undefined;
	actor?: ActorDocument;
	power?: PowerDocument;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
}) => {
	return (
		<div>
			{entries.map((entry, index) => (
				<AttackResultEntry
					{...entry}
					lookupToken={() => (entry.tokenId ? lookupToken(entry.tokenId) : undefined)}
					key={index}
				/>
			))}
			{tool?.system.equipmentProperties?.additionalEffects && actor ? (
				<ToolExtraEffects
					tool={tool}
					additionalEffects={tool?.system.equipmentProperties?.additionalEffects}
					actor={actor}
					power={power}
				/>
			) : null}
		</div>
	);
};

function AttackResultEntry({
	rollData,
	rollResult,
	tokenName,
	lookupToken,
}: AttackResultEntryProps & {
	lookupToken: () => TokenInstance | undefined;
}) {
	const hover = useHoverToken()(lookupToken);
	const control = useControlTokenOnClick()(lookupToken);

	return (
		// TODO: the following styles are a blantant rip-off from Foundry 9. If they break, I'll need to rebuild them somehow.
		<div {...hover}>
			<div {...control}>
				<p>
					<span className="font-bold">Target: </span>
					{tokenName ?? 'Unknown'}
				</p>
				{rollResult === 'critical-hit' ? (
					<p className="text-green-dark">Probable critical hit!</p>
				) : rollResult === 'maybe-critical-hit' ? (
					<p className="text-green-dark">Guaranteed hit!</p>
				) : rollResult === 'critical-miss' ? (
					<p className="text-red-dark">Critical miss!</p>
				) : rollResult === 'hit' ? (
					<p>Probable hit!</p>
				) : rollResult === 'miss' ? (
					<p>Probable miss!</p>
				) : null}
			</div>

			<div className="dice-roll block">
				<RollInfo roll={rollData} rollResult={rollResult ?? undefined} />
			</div>
		</div>
	);
}

function ToolExtraEffects({
	additionalEffects,
	tool,
	power,
	actor,
}: {
	additionalEffects: Partial<Record<AttackEffectTrigger, InstantaneousEffect>>;
	tool: EquipmentDocument<'weapon' | 'implement'>;
	power?: PowerDocument;
	actor: ActorDocument;
}) {
	// TODO: Tool enhancement to damage double-dips here
	return additionalEffects.hit || additionalEffects['critical-hit'] ? (
		<>
			<p>Additional effects:</p>
			{additionalEffects.hit && (
				<InstantaneousEffectSection
					effect={additionalEffects.hit}
					mode="Hit"
					prefix={tool.name ?? undefined}
					source={tool}
					power={power}
					actor={actor}
					allowToolSelection={false}
					allowCritical={false}
					extraBonuses={[]}
				/>
			)}
			{additionalEffects['critical-hit'] && (
				<InstantaneousEffectSection
					effect={additionalEffects['critical-hit']}
					mode="Critical Hit"
					prefix={tool.name ?? undefined}
					source={tool}
					power={power}
					actor={actor}
					allowToolSelection={false}
					allowCritical={false}
					extraBonuses={[]}
				/>
			)}
		</>
	) : null;
}
