import { FormInput } from 'src/components/form-input';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { SimpleDocumentData } from 'dndmashup-react/core/interfaces/simple-document';
import { Lens } from 'src/core/lens';
import { EquipmentData } from '../../dataSourceData';
import { ItemSlot } from '../types';

export function OtherDetails<T extends ItemSlot>({
	itemState: documentState,
}: {
	itemState: Stateful<SimpleDocumentData<EquipmentData<T>>>;
}) {
	const baseLens = Lens.identity<SimpleDocumentData<EquipmentData<T>>>();

	return (
		<>
			<FormInput className="text-lg col-span-2">
				<FormInput.Structured>
					<FormInput.Structured.Main>
						<FormInput.NumberField {...baseLens.toField('data').toField('weight').apply(documentState)} plain />
					</FormInput.Structured.Main>
					lbs.
				</FormInput.Structured>
				<FormInput.Label>Weight ea.</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-2">
				<FormInput.NumberField {...baseLens.toField('data').toField('quantity').apply(documentState)} />
				<FormInput.Label>Quantity</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-2">
				<FormInput.Structured>
					<FormInput.Structured.Main>
						<FormInput.NumberField {...baseLens.toField('data').toField('price').apply(documentState)} plain />
					</FormInput.Structured.Main>
					gp
				</FormInput.Structured>
				<FormInput.Label>Price</FormInput.Label>
			</FormInput>
		</>
	);
}
