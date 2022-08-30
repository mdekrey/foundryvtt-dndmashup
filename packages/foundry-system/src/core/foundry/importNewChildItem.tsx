import { deferredPromise } from '@foundryvtt-dndmashup/core';
import { PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
import { noop } from 'lodash/fp';
import { MashupActor } from '../../module/actor/mashup-actor';
import { MashupItem } from '../../module/item/mashup-item';
import { ImportDialog } from './getImportExportButtons';

export function importNewChildItem(target: MashupActor | MashupItem, type?: PossibleItemType) {
	const { promise, resolve, reject } = deferredPromise<string>();
	const dialog = new ImportDialog(
		type ? JSON.stringify({ type, name: 'Unnamed Item' }) : '',
		resolve,
		{ title: `Import JSON for new Item child of ${target.name}`, close: reject },
		{ resizable: true }
	);
	dialog.render(true);

	promise
		.then(async (newJson) => {
			const newSource = JSON.parse(newJson);
			if (target instanceof Item) {
				if (!target.canEmbedItem(newSource.type as PossibleItemType)) return;
			}
			const [itemPromise] = await target.createEmbeddedDocuments('Item', [newSource]);
			const result = (await itemPromise) as MashupItem;
			result.showEditDialog();

			dialog.close();
		})
		.catch(noop);
}
