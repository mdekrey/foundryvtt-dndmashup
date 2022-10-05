import { AppButton, BlockHeader } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import { ActiveEffectDocument, ActorComponents } from '@foundryvtt-dndmashup/mashup-react';
import { SpecificActor } from '../mashup-actor';
import { SpecificActorDataSource } from '../types';

const baseLens = Lens.identity<SpecificActorDataSource<'monster'>>();
const dataLens = baseLens.toField('system');
const bonusesLens = dataLens.toField('bonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function MonsterSheet({ actor }: { actor: SpecificActor<'monster'> }) {
	const documentState = documentAsState<SpecificActorDataSource<'monster'>>(actor);
	return (
		<article className="flex flex-col h-full theme-olive-dark">
			<header className="flex flex-row gap-1 bg-theme text-white p-2">
				<ActorComponents.MonsterHeader
					nameState={baseLens.toField('name').apply(documentState)}
					imageState={baseLens.toField('img').apply(documentState)}
					sizeState={baseLens.toField('system').toField('size').apply(documentState)}
					detailsState={baseLens.toField('system').toField('details').apply(documentState)}
				/>
			</header>
			<ActorComponents.MonsterVitals documentState={baseLens.toField('system').apply(documentState)} />
			<div className="theme-blue-dark">
				<ActorComponents.Powers actor={actor} />
			</div>
			<BlockHeader>Details</BlockHeader>
			<ActorComponents.MonsterDetails documentState={baseLens.toField('system').apply(documentState)} />
			<BlockHeader>Inventory</BlockHeader>
			<ActorComponents.Inventory actor={actor} />

			<BlockHeader>Features</BlockHeader>

			<div className="flex gap-1 justify-end">
				<AppButton onClick={() => actor.importChildItem('feature')}>New</AppButton>
			</div>
			<ActorComponents.Features
				actor={actor}
				effects={actor.effects.contents as ActiveEffectDocument[]}
				items={actor.items.contents}
				bonuses={bonusesLens.apply(documentState)}
				dynamicList={dynamicListLens.apply(documentState)}
			/>
			<ActorComponents.Effects
				actor={actor}
				bonusList={actor.derivedCache.bonuses.getAll()}
				triggeredEffects={actor.derivedCache.triggeredEffects.getAll()}
				dynamicList={actor.derivedCache.lists.getAll()}
			/>
		</article>
	);
}
