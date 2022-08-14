import { Fragment, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, SearchIcon } from '@heroicons/react/solid';
import { SelectItem } from '../select';
import { ImmutableMutator, Primitive } from '@foundryvtt-dndmashup/mashup-core';
import classNames from 'classnames';
import { DetailsModalButton } from '../../details-modal-button';
import { Container } from '../container';
import { Structured } from '../structured-field';
import { Label } from '../label';

export function MultiSelect<TValue extends Primitive>({
	value,
	options,
	onChangeValue,
}: {
	value: TValue[];
	options: SelectItem<TValue>[];
	onChangeValue?: ImmutableMutator<TValue[]>;
}) {
	const [query, setQuery] = useState('');

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return `${option.value}`.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<DetailsModalButton
			modalTitle="Select..."
			buttonContents={
				value.length > 0
					? value
							.map((valueEntry) => options.find((opt) => opt.value === valueEntry))
							.filter((opt): opt is SelectItem<TValue> => !!opt)
							.map((option, index) => (
								<Fragment key={option.key}>
									{index === 0 ? '' : ', '}
									{option.label}
								</Fragment>
							))
					: 'normal'
			}
			modalContents={({ onClose }) => {
				const comboboxOnChange: React.Dispatch<React.SetStateAction<TValue[]>> = (param) => {
					if (onChangeValue)
						onChangeValue(
							(oldValue) => {
								if (typeof param === 'function') return param(oldValue as TValue[]);
								return param;
							},
							{ deleteData: true }
						);
					setQuery('');
				};
				return (
					<Combobox value={value} onChange={comboboxOnChange} multiple>
						<Container>
							<Structured>
								<SearchIcon className="h-5 w-5" aria-hidden="true" />
								<Structured.Main>
									<Combobox.Input
										className="w-full"
										displayValue={(v: TValue) => options.find((opt) => opt.value === v)?.typeaheadLabel ?? ''}
										onChange={(event) => setQuery(event.target.value)}
									/>
								</Structured.Main>
							</Structured>
							<Label>Search</Label>
						</Container>

						<div className="max-h-96 overflow-y-auto">
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
						</div>
					</Combobox>
				);
			}}
		/>
	);
}
