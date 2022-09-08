import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { keywordsAsStringLens, Lens, Stateful } from '@foundryvtt-dndmashup/core';
import {
	calculateMonsterXp,
	MonsterPowerLevel,
	powerLevels,
	roles,
	Size,
	sizes,
} from '@foundryvtt-dndmashup/mashup-rules';
import { MonsterDetails } from '../types';

const detailsLens = Lens.identity<MonsterDetails>();

const powerOptions = powerLevels.map(
	({ key, label }): SelectItem<MonsterPowerLevel> => ({ key, value: key, label, typeaheadLabel: label })
);
const roleOptions = roles.map(
	({ key, label }): SelectItem<string> => ({ key, value: key, label, typeaheadLabel: label })
);
const sizeOptions = sizes.map(
	(size): SelectItem<Size> => ({
		key: size,
		value: size,
		label: `${size[0].toUpperCase()}${size.substring(1)}`,
		typeaheadLabel: size,
	})
);

const keywordsLens = Lens.fromProp<MonsterDetails>()('keywords').combine(keywordsAsStringLens);

export function MonsterHeader({
	nameState,
	imageState,
	sizeState,
	detailsState,
}: {
	nameState: Stateful<string>;
	imageState: Stateful<string | null>;
	sizeState: Stateful<Size>;
	detailsState: Stateful<MonsterDetails>;
}) {
	return (
		<>
			<FormInput.ImageEditor {...imageState} title={nameState.value} />
			<div className="grid grid-cols-12 grid-rows-2 gap-x-1 text-lg flex-grow">
				<FormInput className="col-span-5">
					<FormInput.TextField {...nameState} />
					<FormInput.Label>Monster Name</FormInput.Label>
				</FormInput>
				<FormInput>
					<FormInput.NumberField
						{...detailsLens.toField('level').apply(detailsState)}
						className="text-lg text-center"
					/>
					<FormInput.Label>Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.Select {...detailsLens.toField('power').apply(detailsState)} options={powerOptions} />
					<FormInput.Label>Power</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.Select {...detailsLens.toField('role').apply(detailsState)} options={roleOptions} />
					<FormInput.Label>Role</FormInput.Label>
				</FormInput>
				<FormInput.Inline className="col-span-2 self-center">
					<FormInput.Checkbox {...detailsLens.toField('leader').apply(detailsState)} />
					<FormInput.Label>is leader</FormInput.Label>
				</FormInput.Inline>

				{/* size, origin, type */}
				<FormInput className="col-span-2">
					<FormInput.Select {...sizeState} options={sizeOptions} />
					<FormInput.Label>Size</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.TextField {...detailsLens.toField('origin').apply(detailsState)} />
					<FormInput.Label>Origin</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.TextField {...detailsLens.toField('type').apply(detailsState)} />
					<FormInput.Label>Type</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-4">
					<FormInput.TextField {...keywordsLens.apply(detailsState)} />
					<FormInput.Label>Keywords</FormInput.Label>
				</FormInput>

				<FormInput className="col-span-2">
					<FormInput.Field>
						<span className="text-lg text-center">
							{calculateMonsterXp(detailsState.value.level, detailsState.value.power)}
						</span>
					</FormInput.Field>
					<FormInput.Label>EXP</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
