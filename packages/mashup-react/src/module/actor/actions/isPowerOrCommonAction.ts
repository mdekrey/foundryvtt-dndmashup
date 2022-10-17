import { PowerDocument } from '../../item/subtypes/power/dataSourceData';
import { CommonAction } from './common-action';

export function isPowerOrCommonAction(item: PowerDocument | CommonAction): item is PowerDocument {
	return 'id' in item;
}
