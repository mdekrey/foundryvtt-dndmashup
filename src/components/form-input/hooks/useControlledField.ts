import { SetStateAction, useRef } from 'react';

type NoFunctionValue = boolean | string | number | null | undefined | object | Array<unknown>;

export function useControlledField<TValue extends NoFunctionValue>(dataValue: TValue) {
	const actualValue = useRef([dataValue, dataValue]);

	if (actualValue.current[0] !== dataValue) {
		actualValue.current = [dataValue, dataValue];
	}
	const value = actualValue.current[1];

	return [
		value,
		(v: SetStateAction<TValue>) => (actualValue.current[1] = typeof v === 'function' ? v(actualValue.current[1]) : v),
	] as const;
}
