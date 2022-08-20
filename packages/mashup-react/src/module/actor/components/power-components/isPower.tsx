import { CommonAction } from './CommonAction';
import { PowerDocument } from '../../../item/subtypes/power/dataSourceData';

export function isPower(item: PowerDocument | CommonAction): item is PowerDocument {
	return 'id' in item;
}
