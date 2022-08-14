import { Combobox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import SelectorIcon from '@heroicons/react/solid/SelectorIcon';
import classNames from 'classnames';
import { ReactNode, Key, useState, useCallback, useRef } from 'react';
import { ImmutableMutator, Primitive } from '@foundryvtt-dndmashup/mashup-core';
import { Field } from '../field';
import { Modal } from '../../modal';

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
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isOpen, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const comboboxOnChange = useCallback<React.Dispatch<React.SetStateAction<TValue>>>(
		(param) => {
			if (onChangeValue)
				onChangeValue((oldValue) => {
					if (typeof param === 'function') return param(oldValue as TValue);
					return param;
				});
			if (onChange) onChange(typeof param === 'function' ? param(value) : param);
			setQuery('');
			buttonRef.current?.focus();
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
			<button
				type="button"
				className={classNames(
					'relative w-full h-full text-left',
					'cursor-default overflow-hidden',
					'flex items-center'
				)}
				ref={buttonRef}
				onClick={() => setOpen(true)}>
				<span className="pl-1 flex items-center">{options.find((opt) => opt.value === value)?.label ?? null}</span>

				<span className="absolute inset-y-0 right-0 flex items-center pr-1">
					<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</span>
			</button>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Select...">
				<div
					onBlur={() => {
						setOpen(false);
						buttonRef.current?.focus();
					}}>
					<Combobox value={value} onChange={comboboxOnChange}>
						<Field>
							<Combobox.Input
								className="w-full pl-1"
								displayValue={(v: TValue) => options.find((opt) => opt.value === v)?.typeaheadLabel ?? ''}
								onChange={(event) => setQuery(event.target.value)}
								autoFocus
								ref={(input: HTMLInputElement | null) => {
									console.log(input);
									setTimeout(() => input?.focus(), 100);
								}}
							/>
						</Field>

						<div className="max-h-96 overflow-y-scroll">
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
				</div>
			</Modal>
		</div>
	);

	return plain ? inner : <Field>{inner}</Field>;
}

export const Select = Object.assign(SelectComponent, {
	recordToSelectItems,
	numericRecordToSelectItems,
});
