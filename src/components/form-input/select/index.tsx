import { Combobox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import SelectorIcon from '@heroicons/react/solid/SelectorIcon';
import classNames from 'classnames';
import { ReactNode, Key, useState, useCallback } from 'react';
import { Primitive } from 'src/core/path-typings';
import { Field } from '../field';
import { ImmutableMutator } from '../hooks/useDocumentAsState';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
	typeaheadLabel: string;
};

export function SelectOld<TValue extends Primitive>({
	value,
	plain,
	options,
	onChangeValue,
	...selectProps
}: {
	value: TValue;
	plain?: boolean;
	options: SelectItem<TValue>[];
	onChangeValue?: ImmutableMutator<TValue>;
} & Omit<JSX.IntrinsicElements['select'], 'value'>) {
	const currentEntry = options.find((k) => k.value === value) ?? options[0];
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
					const newEntry = options.find((k) => k.key === ev.currentTarget.value);
					const newValue = newEntry ? newEntry.value : options[0].value;
					if (newEntry !== currentEntry) onChangeValue(() => newValue);
				},
		  }
		: {};
	const input = (
		<select value={currentEntry.key} {...selectProps} {...onChangeProps}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}

export function Select<TValue extends Primitive | object>({
	value,
	plain,
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
	const comboboxOnChange = useCallback<React.Dispatch<React.SetStateAction<TValue>>>(
		(param) => {
			console.log(param);
			if (onChangeValue)
				onChangeValue((oldValue) => {
					if (typeof param === 'function') return param(oldValue as TValue);
					return param;
				});
			if (onChange) onChange(typeof param === 'function' ? param(value) : param);
			setQuery('');
		},
		[onChangeValue, onChange, value]
	);

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return option.typeaheadLabel.toLowerCase().includes(query.toLowerCase());
			  });

	const inner = (
		<div className={classNames('relative', className)}>
			<div className={classNames('group', 'relative w-full h-full text-left', 'cursor-default overflow-hidden')}>
				<span className="group-focus-within:hidden absolute inset-y-0 pl-1 flex items-center pointer-events-none">
					{options.find((opt) => opt.value === value)?.label ?? null}
				</span>
				<Combobox.Input
					className="w-full border-none pl-1 pr-10 leading-5 text-gray-900 focus:ring-0 opacity-0 focus:opacity-100"
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
		<Combobox value={value} onChange={comboboxOnChange}>
			{plain ? inner : <Field>{inner}</Field>}
		</Combobox>
	);
}
