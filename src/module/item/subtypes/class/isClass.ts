import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { ClassDocument } from './dataSourceData';
import { MashupItemClass } from './config';

export function isClass(item: SimpleDocument): item is ClassDocument;
export function isClass(item: MashupItemBase): item is MashupItemClass;
export function isClass(item: MashupItemBase | SimpleDocument): item is MashupItemClass | ClassDocument {
	return item.type === 'class';
}
