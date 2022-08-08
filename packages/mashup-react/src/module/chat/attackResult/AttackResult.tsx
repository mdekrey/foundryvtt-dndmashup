import classNames from 'classnames';
import React, { useRef } from 'react';
import { TokenDocument } from '../../actor';
import { RollJson } from '../../roll';

export type RollResult = 'hit' | 'miss' | 'critical-miss' | 'maybe-critical-hit' | 'critical-hit';

export type AttackResultEntryProps = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: RollResult | null;
	rollData: RollJson;
};

export const AttackResult = ({
	summary,
	entries,
	lookupToken,
}: {
	summary: string;
	entries: AttackResultEntryProps[];
	lookupToken: (tokenId: string) => TokenDocument | undefined;
}) => (
	<div>
		<p>{summary}</p>
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
			const temp: any = hovered.current;
			if (temp._onHoverIn) {
				temp._onHoverIn(event.nativeEvent);
			}
		}
	}
	function onMouseLeave(event: React.MouseEvent) {
		if (hovered.current) {
			const temp: any = hovered.current;
			if (temp._onHoverOut) {
				temp._onHoverOut(event.nativeEvent);
			}
			hovered.current = undefined;
		}
	}

	return (
		// TODO: the following styles are a blantant rip-off from Foundry 9. If they break, I'll need to rebuild them somehow.
		<div className="dice-roll block" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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

			<div className="dice-result">
				<div className="dice-formula border border-gray-300">{rollData.formula}</div>

				<div className="dice-tooltip">
					{rollData.terms
						.filter(
							(
								term
							): term is {
								class: 'Die';
								formula: string;
								faces: number;
								number: number;
								results: { result: number; active: boolean }[];
							} => term.class === 'Die'
						)
						.map((term, index) => (
							<section className="tooltip-part" key={index}>
								<div className="dice">
									<header className="part-header flexrow border-b-2 border-gray-300">
										<span className="part-formula font-bold">
											{term.number}d{term.faces}
										</span>

										<span className="part-total">
											{term.results.filter(({ active }) => active).reduce((a, b) => a + b.result, 0)}
										</span>
									</header>
									{term.results ? (
										<ol className="dice-rolls my-2">
											{term.results.map((result, index) => (
												<li key={index} className={`roll die d${term.faces}`}>
													{result.result}
												</li>
											))}
										</ol>
									) : null}
								</div>
							</section>
						))}
				</div>
				<h4
					className={classNames('dice-total border border-gray-300', 'font-bold text-lg', {
						'text-green-dark': rollResult === 'critical-hit' || rollResult === 'maybe-critical-hit',
						'text-red-dark': rollResult === 'critical-miss',
					})}>
					{rollData.total}
				</h4>
			</div>
		</div>
	);
}
