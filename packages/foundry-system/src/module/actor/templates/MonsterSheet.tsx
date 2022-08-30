import { BlockHeader } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import { ActorComponents } from '@foundryvtt-dndmashup/mashup-react';
import { SpecificActor } from '../mashup-actor';
import { SpecificActorData } from '../types';

const baseLens = Lens.identity<SpecificActorData<'monster'>>();

export function MonsterSheet({ actor }: { actor: SpecificActor<'monster'> }) {
	const documentState = documentAsState<SpecificActorData<'monster'>>(actor);
	return (
		<article className="flex flex-col h-full theme-olive-dark">
			<header className="flex flex-row gap-1 bg-theme text-white p-2">
				<ActorComponents.MonsterHeader
					nameState={baseLens.toField('name').apply(documentState)}
					imageState={baseLens.toField('img').apply(documentState)}
					sizeState={baseLens.toField('data').toField('size').apply(documentState)}
					detailsState={baseLens.toField('data').toField('details').apply(documentState)}
				/>
			</header>
			<ActorComponents.MonsterVitals documentState={baseLens.toField('data').apply(documentState)} />
			<BlockHeader>Actions</BlockHeader>
			<div className="theme-blue-dark">
				<ActorComponents.Powers actor={actor} />
			</div>
			<BlockHeader>Details</BlockHeader>
			<ActorComponents.MonsterDetails documentState={baseLens.toField('data').apply(documentState)} />
			<BlockHeader>Inventory</BlockHeader>
			<ActorComponents.Inventory actor={actor} />
		</article>
	);
}
