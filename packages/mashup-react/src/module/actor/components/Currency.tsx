import { FormInput, Table } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { currencies, Currency } from '@foundryvtt-dndmashup/mashup-rules';

type Currencies = {
	[currency in Currency]: number;
};

const lensBase = Lens.fromProp<Currencies>();

export function CurrencyEditor(currencyState: Stateful<Currencies>) {
	return (
		<Table>
			<Table.HeaderRow>
				<th>Currency</th>
			</Table.HeaderRow>
			<Table.Body>
				<tr>
					<div className="flex gap-1">
						{currencies.map((currency) => (
							<div key={currency} className="flex-grow">
								<FormInput className="inline-block">
									<FormInput.NumberField {...lensBase(currency).apply(currencyState)} className="text-lg text-center" />
									<FormInput.Label>{currency.toUpperCase()}</FormInput.Label>
								</FormInput>
							</div>
						))}
					</div>
				</tr>
			</Table.Body>
		</Table>
	);
}
