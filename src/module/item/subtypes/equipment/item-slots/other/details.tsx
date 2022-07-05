import { FormInput } from 'src/components/form-input';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupItemEquipment } from '../../config';
import { ItemSlot } from '../types';

export function OtherDetails<T extends ItemSlot>({
	itemState: documentState,
}: {
	itemState: Stateful<SourceDataOf<MashupItemEquipment<T>>>;
}) {
	const baseLens = Lens.identity<SourceDataOf<MashupItemEquipment<T>>>();

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
