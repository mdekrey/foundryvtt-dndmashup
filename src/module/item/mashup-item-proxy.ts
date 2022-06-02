import { itemMappings } from './subtypes';
import { PossibleItemType } from './types';
import { MashupItem, MashupItemBase } from './mashup-item';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncWithoutThis<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;

const create = function (data: Record<string, unknown>, options) {
	if (!data) throw new Error('No data for item');

	const type = data.type as PossibleItemType;

	if (!itemMappings.hasOwnProperty(type)) throw new Error(`Unsupported Entity type for create(): ${type}`);

	return itemMappings[type].create(data, options);
} as FuncWithoutThis<typeof MashupItem['create']>;

export const MashupItemProxy = new Proxy<typeof MashupItemBase>(MashupItemBase, {
	//Will intercept calls to the "new" operator
	construct: function (target, args: ConstructorParameters<typeof MashupItem>) {
		const [data] = args;

		if (!data) throw new Error('No data for item');

		//Handle missing mapping entries
		if (!itemMappings.hasOwnProperty(data.type)) throw new Error(`Unsupported Entity type for create(): ${data.type}`);

		//Return the appropriate, actual object from the right class
		return new itemMappings[data.type](...args);
	},

	//Property access on this weird, dirty proxy object
	get: function (target, prop) {
		switch (prop) {
			case 'create':
			case 'createDocuments':
				//Calling the class' create() static function
				return function (data: Record<string, unknown> | Array<Record<string, unknown>>, options) {
					if (Array.isArray(data)) {
						//Array of data, this happens when creating Actors imported from a compendium
						return data.map((i) => create(i, options));
					}
					return create(data, options);
				} as typeof MashupItem['create'];

			case Symbol.hasInstance:
				//Applying the "instanceof" operator on the instance object
				return function (instance: unknown) {
					return Object.values(itemMappings).some((i) => instance instanceof i);
				};

			default:
				//Just forward any requested properties to the base Actor class
				return (Item as never)[prop];
		}
	},
});
