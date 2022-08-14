import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ImmutableMutator } from '@foundryvtt-dndmashup/mashup-core';

export type DocumentSelectorProps<T extends SimpleDocument | null> = {
	documents: Exclude<T, null>[];
	value: T;
	onChange?: (selectedItem: T) => void;
	onChangeValue?: ImmutableMutator<T>;
	allowNull?: null extends T ? true : false;
};

export function DocumentSelector<T extends SimpleDocument | null>({
	allowNull,
	documents,
	value,
	onChange,
	onChangeValue,
}: DocumentSelectorProps<T>) {
	const options: SelectItem<T>[] = [
		...(allowNull
			? [
					{
						key: '',
						typeaheadLabel: '<None>',
						value: null as T,
						label: (
							<>
								<img src="icons/svg/cancel.svg" alt="" className="w-8 h-8 inline-block mr-1" /> &lt;None&gt;
							</>
						),
					},
			  ]
			: []),
		...documents.map(
			(item): SelectItem<T> => ({
				key: item.id ?? '',
				typeaheadLabel: item.name ?? '',
				value: item,
				label: (
					<>
						{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block mr-1" /> : null} {item.name}
					</>
				),
			})
		),
	];
	return <FormInput.Select value={value} options={options} onChange={onChange} onChangeValue={onChangeValue} />;
}
