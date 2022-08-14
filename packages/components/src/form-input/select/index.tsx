import { Combobox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import classNames from 'classnames';
import { ReactNode, Key, useState } from 'react';
import { ImmutableMutator, Primitive } from '@foundryvtt-dndmashup/mashup-core';
import { DetailsModalButton } from '../../details-modal-button';
import { Structured } from '../structured-field';
import { SearchIcon } from '@heroicons/react/solid';
import { Container } from '../container';
import { Label } from '../label';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
	typeaheadLabel: string;
};

export function recordToSelectItems<TKey extends React.Key & string>(record: Record<TKey, string>): SelectItem<TKey>[] {
	return Object.entries(record).map(([value, label]) => ({
		value: value as TKey,
		key: value,
		label: label as React.ReactNode,
		typeaheadLabel: label as string,
	}));
}

export function numericRecordToSelectItems<TKey extends React.Key & number>(
	record: Record<TKey, string>
): SelectItem<TKey>[] {
	return Object.entries(record).map(([value, label]) => ({
		value: Number(value) as TKey,
		key: value,
		label: label as React.ReactNode,
		typeaheadLabel: label as string,
	}));
}

function SelectComponent<TValue extends Primitive | object>({
	value,
	options,
	onChange,
	onChangeValue,
	className,
}: {
	value: TValue;
	plain?: boolean;
	options: SelectItem<TValue>[];
	onChange?: (value: TValue) => void;
	onChangeValue?: ImmutableMutator<TValue>;
	className?: string;
}) {
	const [query, setQuery] = useState('');
	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return option.typeaheadLabel.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<DetailsModalButton
			className={className}
			modalTitle="Select..."
			buttonContents={options.find((opt) => opt.value === value)?.label ?? null}
			modalContents={({ onClose }) => {
				const comboboxOnChange: React.Dispatch<React.SetStateAction<TValue>> = (param) => {
					if (onChangeValue)
						onChangeValue((oldValue) => {
							if (typeof param === 'function') return param(oldValue as TValue);
							return param;
						});
					if (onChange) onChange(typeof param === 'function' ? param(value) : param);
					setQuery('');
					onClose();
				};
				return (
					<Combobox value={value} onChange={comboboxOnChange}>
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
								<div className="cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
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

export const Select = Object.assign(SelectComponent, {
	recordToSelectItems,
	numericRecordToSelectItems,
});
