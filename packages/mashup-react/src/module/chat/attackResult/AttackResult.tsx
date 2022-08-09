import React, { useRef } from 'react';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { TokenDocument } from '../../actor';
import { AttackRollResult, RollInfo } from '../../../components';
import { PowerDocument } from '../../item';

export type AttackResultEntryProps = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: AttackRollResult | null;
	rollData: RollJson;
};

export const AttackResult = ({
	entries,
	lookupToken,
}: {
	entries: AttackResultEntryProps[];
	lookupToken: (tokenId: string) => TokenDocument | undefined;
	power?: PowerDocument;
}) => (
	<div>
		{entries.map((entry, index) => (
			<AttackResultEntry
				{...entry}
				lookupToken={() => (entry.tokenId ? lookupToken(entry.tokenId) : undefined)}
				key={index}
			/>
		))}
	</div>
);

function AttackResultEntry({
	rollData,
	rollResult,
	tokenName,
	lookupToken,
}: AttackResultEntryProps & {
	lookupToken: () => TokenDocument | undefined;
}) {
	const hovered = useRef<TokenDocument>();

	function onMouseEnter(event: React.MouseEvent) {
		onMouseLeave(event);
		hovered.current = lookupToken();
		if (hovered.current) {
			// FIXME: this is using internal methods
			const temp: any = hovered.current;
			if (temp._onHoverIn) {
				temp._onHoverIn(event.nativeEvent);
			}
		}
	}
	function onMouseLeave(event: React.MouseEvent) {
		if (hovered.current) {
			// FIXME: this is using internal methods
			const temp: any = hovered.current;
			if (temp._onHoverOut) {
				temp._onHoverOut(event.nativeEvent);
			}
			hovered.current = undefined;
		}
	}

	function onClick(event: React.MouseEvent) {
		const releaseOthers = !event.shiftKey;
		if (hovered.current) {
			hovered.current.control?.({ releaseOthers });
		}
	}

	return (
		// TODO: the following styles are a blantant rip-off from Foundry 9. If they break, I'll need to rebuild them somehow.
		<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<div onClick={onClick}>
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
