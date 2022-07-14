import { Fragment, useCallback, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { SelectItem } from '../select';
import { ImmutableMutator } from 'src/core/lens';
import { Primitive } from 'src/core/path-typings';
import classNames from 'classnames';
import { Field } from '../field';

export function MultiSelect<TValue extends Primitive>({
	value,
	plain,
	options,
	onChangeValue,
}: {
	value: TValue[];
	plain?: boolean;
	options: SelectItem<TValue>[];
	onChangeValue?: ImmutableMutator<TValue[]>;
}) {
	const [query, setQuery] = useState('');
	const comboboxOnChange = useCallback<React.Dispatch<React.SetStateAction<TValue[]>>>(
		(param) => {
			console.log(param);
			if (onChangeValue)
				onChangeValue(
					(oldValue) => {
						if (typeof param === 'function') return param(oldValue as TValue[]);
						return param;
					},
					{ deleteData: true }
				);
			setQuery('');
		},
		[onChangeValue]
	);

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return `${option.value}`.toLowerCase().includes(query.toLowerCase());
			  });

	const inner = (
		<div className="relative">
			<div className={classNames('group', 'relative w-full text-left sm:text-sm', 'cursor-default overflow-hidden')}>
				<span className="group-focus-within:hidden absolute inset-y-0 pl-1 flex items-center pointer-events-none">
					{value.length > 0 &&
						value
							.map((valueEntry) => options.find((opt) => opt.value === valueEntry))
							.filter((opt): opt is SelectItem<TValue> => !!opt)
							.map((option, index) => (
								<Fragment key={option.key}>
									{index === 0 ? '' : ', '}
									{option.label}
								</Fragment>
							))}
				</span>
				<Combobox.Input
					className="w-full border-none pl-1 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
					onChange={(event) => setQuery(event.target.value)}
				/>

				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-1">
					<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</Combobox.Button>
			</div>
			<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
				{filteredOptions.length === 0 && query !== '' ? (
					<div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
				) : (
					filteredOptions.map((person) => (
						<Combobox.Option
							key={person.key}
							value={person.value}
							className={({ active, selected }) =>
								classNames(`relative cursor-default select-none py-2 pl-10 pr-4`, {
									'font-medium': selected,
									'font-normal': !selected,
									'bg-blue-500 text-white': active,
									'text-gray-900': !active,
								})
							}>
							{({ active, selected }) => (
								<>
									{selected && (
										<span
											className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
												active ? 'text-white' : 'text-blue-500'
											}`}>
											<CheckIcon className="h-5 w-5" aria-hidden="true" />
										</span>
									)}
									{person.label}
								</>
							)}
						</Combobox.Option>
					))
				)}
			</Combobox.Options>
		</div>
	);

	return (
		<Combobox value={value} onChange={comboboxOnChange} multiple>
			{plain ? inner : <Field>{inner}</Field>}
		</Combobox>
	);
}
