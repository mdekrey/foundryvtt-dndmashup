import { PowerDocument } from '../../module/item/subtypes/power/dataSourceData';

export type PowerDetailsApplicationParameters = {
	power: PowerDocument;
};

declare global {
	interface MashupApplication {
		powerDetails: PowerDetailsApplicationParameters;
	}
}
